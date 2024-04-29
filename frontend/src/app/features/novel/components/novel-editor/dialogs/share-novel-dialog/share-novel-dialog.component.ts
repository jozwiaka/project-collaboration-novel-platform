import { AuthService } from 'src/app/core/services/auth.service';
import {
  CollaboratorDTO,
  CollaboratorsResponse,
  CollaboratorsSortBy,
} from '../../../../models/collaborator-api.models';
import { UserService } from '../../../../../../core/services/user.service';
import { CollaboratorService } from '../../../../services/collaborator.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  UserDTO,
  UsersResponse,
  UsersSortBy,
} from 'src/app/core/models/user-api.models';
import { Novel } from '../../../../models/novel.model';
import { Page, Sort, SortDirection } from 'src/app/shared/models/api.models';
import { Collaborator } from '../../../../models/collaborator.model';
import { map, mergeMap, forkJoin } from 'rxjs';

@Component({
  selector: 'app-share-novel-dialog',
  templateUrl: './share-novel-dialog.component.html',
  styleUrl: './share-novel-dialog.component.css',
})
export class ShareNovelDialogComponent implements OnInit {
  errorMessage: string = '';
  emails: string = '';
  collaborators: Collaborator[] = [];
  collaboratorsSort: Sort = {
    sortBy: CollaboratorsSortBy.CreatedAt,
    direction: SortDirection.Asc,
  };
  page: Page = {
    size: 0,
    totalElements: 0,
    totalPages: 0,
    number: 0,
  };
  selectedPermissionOption: string = 'canEdit';

  constructor(
    private collaboratorService: CollaboratorService,
    private userService: UserService,
    public authService: AuthService,
    public dialogRef: MatDialogRef<ShareNovelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public novel: Novel
  ) {}

  ngOnInit(): void {
    this.fetchCollaborators();
  }

  fetchCollaborators() {
    if (this.novel.id) {
      this.collaboratorService
        .findByNovelId(this.novel.id, 1, this.collaboratorsSort)
        .pipe(
          map((response) => {
            return {
              collaborators: response._embedded.collaborators,
              page: response.page,
            };
          }),
          mergeMap((data) => {
            const observables = data.collaborators.map((collaboratorData) => {
              return this.collaboratorService.build(collaboratorData);
            });

            if (!observables.length) {
              this.collaborators = [];
              this.page = data.page;
            }

            return forkJoin(observables).pipe(
              map((collaborators) => {
                return { collaborators, page: data.page };
              })
            );
          })
        )
        .subscribe({
          next: ({ collaborators, page }) => {
            this.collaborators = collaborators;
            this.page = page;
          },
          error: (err) => {},
        });
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  canShare(): boolean {
    return this.authService.currentUser?.id === this.novel.author.id;
  }

  onShare(): void {
    const emailsArray: string[] = this.emails
      .split(',')
      .map((email) => email.trim())
      .filter((email) => !!email);
    for (const email of emailsArray) {
      this.userService.findByEmail(email).subscribe({
        next: (userData: UserDTO) => {
          const alreadyExists: boolean = this.collaborators.some(
            (collaborator) => collaborator.user.id === userData.id
          );
          if (!this.novel.id || !userData.id || alreadyExists) {
            return;
          }
          let collaboratorData: CollaboratorDTO = {
            userId: userData.id,
            novelId: this.novel.id,
            readOnly:
              this.selectedPermissionOption === 'canEdit' ? false : true,
          };
          this.collaboratorService
            .create(collaboratorData)
            .pipe(
              mergeMap((collaboratorDataResponse: CollaboratorDTO) => {
                return this.collaboratorService.build(collaboratorDataResponse);
              })
            )
            .subscribe({
              next: (collaborator: Collaborator) => {
                this.collaborators.push(collaborator);
              },
            });
        },
      });
    }
  }
}
