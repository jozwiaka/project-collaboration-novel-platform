import { TagsResponse } from './../../models/tag-api.models';
import { TagService } from './../../services/tag.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { mergeMap, forkJoin, map, switchMap } from 'rxjs';
import { UserDTO } from 'src/app/core/models/user-api.models';
import { CollaboratorDTO } from 'src/app/features/novel/models/collaborator-api.models';
import { Novel } from 'src/app/features/novel/models/novel.model';
import { Page, Sort, SortDirection } from 'src/app/shared/models/api.models';
import { AuthService } from 'src/app/core/services/auth.service';
import { NovelService } from 'src/app/features/novel/services/novel.service';
import { TimeService } from 'src/app/core/services/time.service';
import { NewNovelDialogComponent } from './dialogs/new-novel-dialog/new-novel-dialog.component';
import { NovelDTO, NovelsSortBy } from '../../models/novel-api.models';
import { CollaboratorService } from '../../services/collaborator.service';
import { NewTagDialogComponent } from './dialogs/new-tag-dialog/new-tag-dialog.component';
import { TagDTO, TagsSortBy } from '../../models/tag-api.models';
import { Tag } from '../../models/tag.model';

enum NovelOption {
  AllNovels = 'all novels',
  YourNovels = 'your novels',
  SharedWithYou = 'shared with you',
}

@Component({
  selector: 'app-novel-list',
  templateUrl: './novel-list.component.html',
  styleUrls: ['./novel-list.component.css'],
})
export class NovelListComponent implements OnInit {
  filterOption: NovelOption = NovelOption.AllNovels;
  novels: Novel[] = [];
  novelsPage: Page = {
    size: 0,
    totalElements: 0,
    totalPages: 0,
    number: 0,
  };

  novelsSort: Sort = {
    sortBy: NovelsSortBy.UpdatedAt,
    direction: SortDirection.Desc,
  };

  errorMessage: string = '';

  NovelOption = NovelOption;
  NovelsSortBy = NovelsSortBy;
  SortDirection = SortDirection;
  dropdownOpen = false;

  searchQuery: string = '';

  tags: Tag[] = [];

  constructor(
    private novelService: NovelService,
    private authService: AuthService,
    public timeService: TimeService,
    private collaboratorService: CollaboratorService,
    private tagService: TagService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.changeNovelOption(NovelOption.AllNovels);
    this.fetchData();
  }

  fetchData() {
    if (this.authService.currentUser?.id) {
      const tagsSort: Sort = {
        sortBy: TagsSortBy.Name,
        direction: SortDirection.Desc,
      };
      this.tagService
        .findByUserId(this.authService.currentUser?.id, 1, tagsSort)
        .subscribe({
          next: (response: TagsResponse) => {
            // response.novelsPage.totalElements
          },
        });
    }
  }

  navigateToUserSettings(): void {
    this.router.navigate(['/user/settings']);
  }

  onSearchChange(): void {
    this.getDataFromCurrentPages();
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  createBlankNovel(): void {
    const dialogRef = this.dialog.open(NewNovelDialogComponent, {
      width: '600px',
      height: 'auto', // Set the height to auto to allow the dialog to adjust based on content
      data: {},
    });

    dialogRef.afterClosed().subscribe((novelTitle) => {
      if (!this.authService.currentUser?.id || !novelTitle) {
        return;
      }
      let novelData: NovelDTO = {
        title: novelTitle,
        authorId: this.authService.currentUser.id,
      };
      for (let i = 0; i < 1; i++) {
        this.novelService.create(novelData).subscribe({
          next: (response: NovelDTO) => {
            if (this.authService?.currentUser?.id && response.id) {
              let collaboratorData: CollaboratorDTO = {
                userId: this.authService.currentUser.id,
                novelId: response.id,
                readOnly: false,
              };
              this.collaboratorService.create(collaboratorData).subscribe({
                next: () => {
                  this.router.navigateByUrl(`novel/${response.id}`);
                },
              });
            }
          },
        });
      }
    });
  }

  createNewTag(): void {
    const dialogRef = this.dialog.open(NewTagDialogComponent, {
      width: '600px',
      height: 'auto', // Set the height to auto to allow the dialog to adjust based on content
    });

    dialogRef.afterClosed().subscribe((tagTitle) => {
      if (!this.authService.currentUser?.id || !tagTitle) {
        return;
      }
      let tagData: TagDTO = {
        name: tagTitle,
        userId: this.authService.currentUser.id,
      };
      this.tagService
        .create(tagData)
        .pipe(
          switchMap((response: TagDTO) => {
            return this.tagService.build(response);
          })
        )
        .subscribe({
          next: (tag: Tag) => {
            this.tags.push(tag);
            this.tags.sort((a, b) => a.name.localeCompare(b.name));
          },
        });
    });
  }

  removeNovel(novel: Novel): void {
    if (!novel.id || !novel.author.id || !this.authService.currentUser?.id) {
      return;
    }

    if (this.authService.currentUser.id === novel.author.id) {
      this.novelService.remove(novel.id).subscribe({
        next: () => {
          this.getDataFromCurrentPages();
        },
      });
    } else {
      this.collaboratorService
        .findByNovelIdAndUserId(novel.id, this.authService.currentUser?.id)
        .subscribe({
          next: (response: CollaboratorDTO) => {
            if (response.id) {
              this.collaboratorService.remove(response.id).subscribe();
            }
          },
        });
    }
  }

  navigateToNovel(id: number): void {
    this.router.navigateByUrl(`novel/${id}`);
  }

  getOwnerName(author: UserDTO): string {
    if (author.id === this.authService.currentUser?.id) {
      return 'You';
    }
    return author.name;
  }

  getHowManyPagesToShow(): number {
    const diff = this.novelsPage.totalElements - this.novels.length;
    if (diff < this.novelsPage.size) {
      return diff;
    }
    return this.novelsPage.size;
  }

  resetOptions(): void {
    this.filterOption = NovelOption.AllNovels;
    this.novelsSort = {
      sortBy: NovelsSortBy.UpdatedAt,
      direction: SortDirection.Desc,
    };
  }

  changeNovelOption(newNovelOption: NovelOption): void {
    this.resetOptions();
    this.filterOption = newNovelOption;
    this.getDataFromPages(1);
  }

  changeSortBy(newSortBy: NovelsSortBy): void {
    if (this.novelsSort.sortBy === newSortBy) {
      if (this.novelsSort.direction === SortDirection.Asc) {
        this.novelsSort.direction = SortDirection.Desc;
      } else {
        this.novelsSort.direction = SortDirection.Asc;
      }
    } else {
      this.novelsSort.sortBy = newSortBy;
      this.novelsSort.direction = SortDirection.Desc;
    }
    this.getDataFromCurrentPages();
  }

  getDataFromCurrentPages() {
    this.getDataFromPages(this.novelsPage.number + 1);
  }

  getDataFromNextPage() {
    this.novelsPage.number++;
    this.getDataFromPages(this.novelsPage.number + 1);
  }

  getDataFromAllPages() {
    this.getDataFromPages(this.novelsPage.totalPages);
  }

  private getDataFromPages(pages: number) {
    let userData = this.authService.currentUser;
    if (userData?.id) {
      let serviceMethod;
      switch (this.filterOption) {
        case NovelOption.AllNovels:
          if (this.searchQuery !== '') {
            serviceMethod =
              this.novelService.findByCollaboratorsUserIdAndTitleContaining(
                userData.id,
                pages,
                this.novelsSort,
                this.searchQuery
              );
          } else {
            serviceMethod = this.novelService.findByCollaboratorsUserId(
              userData.id,
              pages,
              this.novelsSort
            );
          }
          break;
        case NovelOption.YourNovels:
          if (this.searchQuery !== '') {
            serviceMethod = this.novelService.findByAuthorIdAndTitleContaining(
              userData.id,
              pages,
              this.novelsSort,
              this.searchQuery
            );
          } else {
            serviceMethod = this.novelService.findByAuthorId(
              userData.id,
              pages,
              this.novelsSort
            );
          }
          break;
        case NovelOption.SharedWithYou:
          if (this.searchQuery !== '') {
            serviceMethod =
              this.novelService.findSharedWithUserIdAndTitleContaining(
                userData.id,
                pages,
                this.novelsSort,
                this.searchQuery
              );
          } else {
            serviceMethod = this.novelService.findSharedWithUserId(
              userData.id,
              pages,
              this.novelsSort
            );
          }
          break;
        default:
          return;
      }

      serviceMethod
        .pipe(
          map((response) => {
            return {
              novels: response._embedded.novels,
              page: response.page,
            };
          }),
          mergeMap((data) => {
            const observables = data.novels.map((novelData) => {
              return this.novelService.build(novelData);
            });

            if (!observables.length) {
              this.novels = [];
              this.novelsPage = data.page;
            }

            return forkJoin(observables).pipe(
              map((novels) => {
                return { novels, novelsPage: data.page };
              })
            );
          })
        )
        .subscribe({
          next: ({ novels, novelsPage }) => {
            this.novels = novels;
            this.novelsPage = novelsPage;
          },
          error: (err) => {},
        });
    }
  }
}
