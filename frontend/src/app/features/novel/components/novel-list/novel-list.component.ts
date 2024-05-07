import { TagsResponse } from './../../models/tag-api.models';
import { TagService } from './../../services/tag.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { mergeMap, forkJoin, map, switchMap, Observable, of } from 'rxjs';
import { UserDTO } from 'src/app/core/models/user-api.models';
import { CollaboratorDTO } from 'src/app/features/novel/models/collaborator-api.models';
import { Novel } from 'src/app/features/novel/models/novel.model';
import { Page, Sort, SortDirection } from 'src/app/core/models/api.models';
import { AuthService } from 'src/app/core/services/auth.service';
import { NovelService } from 'src/app/features/novel/services/novel.service';
import { TimeService } from 'src/app/core/services/time.service';
import { NewNovelDialogComponent } from './dialogs/new-novel-dialog/new-novel-dialog.component';
import { NovelDTO, NovelsSortBy } from '../../models/novel-api.models';
import { CollaboratorService } from '../../services/collaborator.service';
import { NewTagDialogComponent } from './dialogs/new-tag-dialog/new-tag-dialog.component';
import { TagDTO, TagsSortBy } from '../../models/tag-api.models';
import { Tag } from '../../models/tag.model';
import { EditTagDialogComponent } from './dialogs/edit-tag-dialog/edit-tag-dialog.component';
import { NovelTagService } from '../../services/novel-tag.service';
import { NovelTagDTO } from '../../models/novel-tag-api';
import { NovelCheckbox } from './models/novel-checkbox.model';
import { NovelsFilterOption } from './models/novels-filter-option.model';
import { TagCheckbox } from './models/tag-checkbox.model';
import { TagMenu } from './models/tag-menu.model';

@Component({
  selector: 'app-novel-list',
  templateUrl: './novel-list.component.html',
  styleUrls: ['./novel-list.component.css'],
})
export class NovelListComponent implements OnInit {
  NovelsFilterOption = NovelsFilterOption;
  NovelsSortBy = NovelsSortBy;
  SortDirection = SortDirection;

  novelsFilterOption: string = NovelsFilterOption.AllNovels;
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

  novelCheckboxes: NovelCheckbox[] = [];
  tagCheckboxes: TagCheckbox[] = [];
  checkAllNovelCheckboxes = false;

  searchOption: string = '';
  searchQuery: string = '';

  activeTag: Tag | undefined;
  tagMenu: TagMenu = {
    tagId: 0,
    show: false,
  };

  showAddToTag: boolean = false;

  constructor(
    private novelService: NovelService,
    private authService: AuthService,
    public timeService: TimeService,
    private collaboratorService: CollaboratorService,
    private novelTagService: NovelTagService,
    private tagService: TagService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.changeNovelsFilterOption(NovelsFilterOption.AllNovels);
    this.fetchAuthUserTags();
  }

  navigateToUserSettings(): void {
    this.router.navigate(['/user/settings']);
  }

  onSearchChange(): void {
    this.getDataFromCurrentPages();
  }

  toggleTagMenu(tagId: number | undefined): void {
    if (!tagId) {
      return;
    }
    if (this.tagMenu.tagId === tagId) {
      this.tagMenu.show = !this.tagMenu.show;
    } else {
      this.tagMenu.tagId = tagId;
      this.tagMenu.show = true;
    }
  }

  toggleAddToTag() {
    this.showAddToTag = !this.showAddToTag;
    if (this.showAddToTag) {
      this.updateTagCheckboxes();
    }
  }

  toggleTagCheckbox(tagCheckbox: TagCheckbox) {
    // tagCheckbox.toggleCheck();
    // const checkedNovels = this.getCheckedNovels();
    // const checkedNovelsToAdd = checkedNovels.filter(
    //   (checkedNovel) =>
    //     !tagCheckbox.tag.novels.find(
    //       (tagNovel) => tagNovel.id === checkedNovel.id
    //     )
    // );
    // tagCheckbox.getChecked()
    //   ? forkJoin(
    //       checkedNovelsToAdd.map((novel) => {
    //         if (
    //           !tagCheckbox.tag.novels.find(
    //             (tagNovel) => tagNovel.id === novel.id
    //           )
    //         ) {
    //           if (tagCheckbox.tag.id && novel.id) {
    //             return this.novelTagService.create({
    //               tagId: tagCheckbox.tag.id,
    //               novelId: novel.id,
    //             });
    //           }
    //         }
    //         return of(null);
    //       })
    //     ).subscribe({
    //       next: () => {
    //         tagCheckbox.tag.novels.push(
    //           ...checkedNovelsToAdd.map((novel) => novel)
    //         );
    //         this.getDataFromCurrentPages();
    //       },
    //     })
    //   : forkJoin(
    //       checkedNovels.map((novel) => {
    //         if (tagCheckbox.tag.id && novel.id) {
    //           return this.novelTagService
    //             .findByNovelIdAndTagId(novel.id, tagCheckbox.tag.id)
    //             .pipe(
    //               mergeMap((novelTagData: NovelTagDTO) => {
    //                 return this.novelTagService.remove(novelTagData.id);
    //               })
    //             );
    //         }
    //         return of(null);
    //       })
    //     ).subscribe({
    //       next: () => {
    //         tagCheckbox.tag.novels = tagCheckbox.tag.novels.filter(
    //           (novel) =>
    //             !checkedNovels.find(
    //               (checkedNovel) => checkedNovel.id === novel.id
    //             )
    //         );
    //         console.log(tagCheckbox.tag.novels.length);
    //         this.getDataFromCurrentPages();
    //       },
    //     });
  }

  toggleNovelCheckbox(novelCheckbox: NovelCheckbox) {
    novelCheckbox.toggleCheck();
    this.getCheckedNovels().length === this.novelCheckboxes.length
      ? (this.checkAllNovelCheckboxes = true)
      : (this.checkAllNovelCheckboxes = false);
    this.updateTagCheckboxes();
  }

  showToolbar(): boolean {
    return !!this.novelCheckboxes.find((ncb) => ncb.getChecked());
  }

  allNovelsCheckboxesChangedEvent() {
    this.checkAllNovelCheckboxes = !this.checkAllNovelCheckboxes;
    this.checkAllNovelCheckboxes
      ? this.novelCheckboxes.forEach((ncb) => {
          ncb.check();
        })
      : this.novelCheckboxes.forEach((ncb) => {
          ncb.uncheck();
        });
  }

  showNewNovelDialog(): void {
    const dialogRef = this.dialog.open(NewNovelDialogComponent, {
      width: '600px',
      height: 'auto',
    });

    dialogRef.afterClosed().subscribe((novelTitle) => {
      this.createNovel(novelTitle);
    });
  }

  showNewTagDialog(): void {
    const dialogRef = this.dialog.open(NewTagDialogComponent, {
      width: '600px',
      height: 'auto', // Set the height to auto to allow the dialog to adjust based on content
    });

    dialogRef.afterClosed().subscribe((tagName) => {
      this.createTag(tagName);
    });
  }

  showEditTagDialog(tag: Tag): void {
    const dialogRef = this.dialog.open(EditTagDialogComponent, {
      width: '600px',
      height: 'auto',
      data: tag.name,
    });

    dialogRef.afterClosed().subscribe((newTagName) => {
      this.updateTag(tag, newTagName);
    });
  }

  removeNovelAction(novel: Novel) {
    this.removeNovelObservable(novel).subscribe({
      next: () => {
        this.getDataFromCurrentPages();
      },
    });
  }

  removeCheckedNovels(): void {
    const novelsToDelete = this.novelCheckboxes
      .filter((ncb) => ncb.getChecked())
      .map((ncb) => ncb.novel);

    const observables = novelsToDelete.map((novel) => {
      if (!novel.id || !this.authService.currentUser?.id) {
        return of(null);
      }
      return this.removeNovelObservable(novel);
    });

    forkJoin(observables.filter((obs) => obs !== null)).subscribe({
      next: () => {
        this.getDataFromCurrentPages();
      },
    });
  }

  removeTag(tag: Tag): void {
    if (tag.id) {
      this.tagService.remove(tag.id).subscribe({
        next: () => {
          this.tagCheckboxes = this.tagCheckboxes.filter(
            (tcb) => tag.id !== tcb.tag.id
          );
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
    const diff = this.novelsPage.totalElements - this.novelCheckboxes.length;
    if (diff < this.novelsPage.size) {
      return diff;
    }
    return this.novelsPage.size;
  }

  resetOptions(): void {
    this.novelsFilterOption = NovelsFilterOption.AllNovels;
    this.novelsSort = {
      sortBy: NovelsSortBy.UpdatedAt,
      direction: SortDirection.Desc,
    };
  }

  changeNovelsFilterOption(newNovelsFilterOption: string): void {
    this.checkAllNovelCheckboxes = false;
    this.resetOptions();
    this.novelsFilterOption = newNovelsFilterOption;
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

  private updateTagCheckboxes() {
    const checkedNovels = this.getCheckedNovels();

    this.tagCheckboxes.forEach((tcb) => {
      let foundNovels = 0;
      checkedNovels.forEach((checkedNovel) => {
        if (tcb.tag.novels.find((novel) => novel.id === checkedNovel.id)) {
          foundNovels++;
        }
      });
      foundNovels === checkedNovels.length ? tcb.check() : tcb.uncheck();
    });
  }

  private fetchAuthUserTags() {
    if (this.authService.currentUser?.id) {
      const tagsSort: Sort = {
        sortBy: TagsSortBy.Name,
        direction: SortDirection.Asc,
      };
      this.tagService
        .findByUserId(this.authService.currentUser?.id, 1, tagsSort)
        .pipe(
          mergeMap((response: TagsResponse) => {
            return forkJoin(
              response._embedded.tags.map((tagData) => {
                return this.tagService.build(tagData);
              })
            );
          })
        )
        .subscribe({
          next: (tags: Tag[]) => {
            this.tagCheckboxes = tags.map((tag) => new TagCheckbox(tag));
            this.sortTagCheckboxes();
          },
        });
    }
  }

  private getDataFromPages(pages: number) {
    let userData = this.authService.currentUser;
    if (userData?.id) {
      let serviceMethod;

      this.activeTag = this.tagCheckboxes.find(
        (tcb) => tcb.tag.name === this.novelsFilterOption
      )?.tag;

      if (this.activeTag?.id) {
        this.searchOption = this.activeTag.name;
        if (this.searchQuery !== '') {
          serviceMethod = this.novelService.findByTagIdAndTitleContaining(
            this.activeTag.id,
            pages,
            this.novelsSort,
            this.searchQuery
          );
        } else {
          serviceMethod = this.novelService.findByTagId(
            this.activeTag.id,
            pages,
            this.novelsSort
          );
        }
      } else {
        switch (this.novelsFilterOption) {
          case NovelsFilterOption.AllNovels:
            this.searchOption = `in ${NovelsFilterOption.AllNovels.toLowerCase()}`;
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
          case NovelsFilterOption.YourNovels:
            this.searchOption = `in ${NovelsFilterOption.YourNovels.toLowerCase()}`;
            if (this.searchQuery !== '') {
              serviceMethod =
                this.novelService.findByAuthorIdAndTitleContaining(
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
          case NovelsFilterOption.SharedWithYou:
            this.searchOption = `in ${NovelsFilterOption.SharedWithYou.toLowerCase()}`;
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
              this.novelCheckboxes = [];
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
            this.novelCheckboxes = novels.map((n) => new NovelCheckbox(n));
            this.novelsPage = novelsPage;
          },
          error: (err) => {},
        });
    }
  }

  private sortTagCheckboxes() {
    this.tagCheckboxes.sort((a, b) => a.tag.name.localeCompare(b.tag.name));
  }

  private createNovel(novelTitle: string) {
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
  }

  private createTag(tagName: string) {
    if (!this.authService.currentUser?.id || !tagName) {
      return;
    }
    let tagData: TagDTO = {
      name: tagName,
      userId: this.authService.currentUser.id,
    };
    this.tagService
      .create(tagData)
      .pipe(
        mergeMap((response: TagDTO) => {
          return this.tagService.build(response);
        })
      )
      .subscribe({
        next: (tag: Tag) => {
          this.tagCheckboxes.push(new TagCheckbox(tag));
          this.sortTagCheckboxes();
        },
      });
  }

  private updateTag(tag: Tag, newTagName: string) {
    if (
      !this.authService.currentUser?.id ||
      newTagName === tag.name ||
      !newTagName
    ) {
      return;
    }
    let tagData: TagDTO = tag.getData();
    tagData.name = newTagName;

    this.tagService.update(tagData).subscribe({
      next: () => {
        this.tagCheckboxes.forEach((tcb) => {
          if (tcb.tag.id === tagData.id) {
            tcb.tag.name = tagData.name;
          }
        });
        this.sortTagCheckboxes();
      },
    });
  }

  private removeNovelObservable(novel: Novel): Observable<any> {
    if (!novel.id || !novel.author.id || !this.authService.currentUser?.id) {
      return of(null);
    }

    return this.authService.currentUser.id === novel.author.id
      ? this.novelService.remove(novel.id)
      : this.collaboratorService
          .findByNovelIdAndUserId(novel.id, this.authService.currentUser.id)
          .pipe(
            switchMap((response: CollaboratorDTO) =>
              this.collaboratorService.remove(response.id)
            )
          );
  }

  private getCheckedNovels(): Novel[] {
    return this.novelCheckboxes
      .filter((ncb) => ncb.getChecked())
      .map((ncb) => ncb.novel);
  }
}
