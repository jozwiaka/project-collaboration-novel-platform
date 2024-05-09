import { NovelDTO } from './../../models/novel-api.models';
import { Message } from './../../models/message.model';
import { CollaboratorDTO } from 'src/app/features/novel/models/collaborator-api.models';
import { UserService } from './../../../../core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { AiRequest, AiResponse } from './../../models/ai-api.models';
import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { AiService } from '../../services/ai.service';
import Quill from 'quill';
import { ShareNovelDialogComponent } from './dialogs/share-novel-dialog/share-novel-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { Novel } from '../../models/novel.model';
import { NovelService } from '../../services/novel.service';
import { AuthService } from 'src/app/core/services/auth.service';
import {
  Observable,
  Subscription,
  forkJoin,
  interval,
  map,
  mergeMap,
  of,
  switchMap,
} from 'rxjs';
import { CollaborationService } from '../../services/collaboration.service';
import { MessageService } from '../../services/message.service';
import { MessageDTO, MessagesSortBy } from '../../models/message-api.models';
import { Page, Sort, SortDirection } from 'src/app/core/models/api.models';
import { TimeService } from 'src/app/core/services/time.service';
import { Collaborator } from '../../models/collaborator.model';
import { CollaboratorService } from '../../services/collaborator.service';
import { User } from 'src/app/core/models/user.model';
import { UserDTO } from 'src/app/core/models/user-api.models';
import { DiffMatchPatch } from 'diff-match-patch-ts';
import {
  CollaborationMessageRequest,
  CollaborationMessageTypeRequest,
  CollaborationMessageResponse,
  CollaborationMessageTypeResponse,
} from '../../models/collaboration-api.models';
import { SuggestionOptions } from './models/suggestion-options.model';
import { MessageData } from './models/message-data.model';

@Component({
  selector: 'app-novel-editor',
  templateUrl: './novel-editor.component.html',
  styleUrls: ['./novel-editor.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NovelEditorComponent implements OnInit, OnDestroy {
  novel: Novel | undefined = undefined;
  readOnly: boolean = false;
  onlineUsers: User[] = [];

  messages: Message[] = [];
  messageContent: string = '';
  messagesSort: Sort = {
    sortBy: MessagesSortBy.UpdatedAt,
    direction: SortDirection.Asc,
  };
  page: Page = {
    size: 0,
    totalElements: 0,
    totalPages: 0,
    number: 0,
  };

  showEditTitleIcon = false;
  showChat = true;
  showAi = true;
  showSuggestionOptions = false;
  generatingSuggestion = false;
  editingTitle = false;
  autosaveEnabled = true;
  isSaved = true;
  initialized = false;

  editor: any;
  toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],
    // [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction
    [{ size: [] }], // custom dropdown
    [{ header: [] }],
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],
    ['clean'], // remove formatting button
  ];

  aiSuggestion: string =
    'The hero charged at the evil witch\'s castle. There, the noble swordsman faced her. "Are you not afraid of me?" asked the knight, his mighty sword in his hand. "I\'m not afraid of anything anymore!" roared the witch, her dark eyes blazing with anger. The knight swung his mighty blade. The wicked witch dropped her broom. Then the heroes fell.';
  suggestionOptions: SuggestionOptions = {
    suggestionLength: 80,
    inputLength: 100,
  };

  @ViewChild('titleInput') titleInput!: ElementRef;
  autosaveIntervalMiliSec = 1000;
  getNovelIntervalMiliSec = 5000;
  private autosaveSubscription!: Subscription;
  private getNovelSubscription!: Subscription;
  private dmp = new DiffMatchPatch();

  constructor(
    private aiService: AiService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private novelService: NovelService,
    private userService: UserService,
    private collaboratorService: CollaboratorService,
    private collaborationService: CollaborationService,
    public authService: AuthService,
    private messageService: MessageService,
    public timeService: TimeService
  ) {}

  ngOnInit() {
    this.fetchInitialData().subscribe(
      ([novel, collaborationData, messageData]) => {
        this.novel = novel;
        this.messages = messageData.messages;
        this.page = messageData.page;
        this.readOnly = collaborationData.readOnly;

        if (this.authService.currentUser?.id && this.novel.id) {
          const collaborationMessageRequest: CollaborationMessageRequest = {
            type: CollaborationMessageTypeRequest.JoinNovel,
            userId: this.authService.currentUser.id,
            novelId: this.novel.id,
          };
          this.collaborationService.send(collaborationMessageRequest);
        }

        this.setUpEditor();
        this.subscribeCollaborationWebSocket();
        this.subscribeAutosaveIfEnabled();
        this.subscribeGetNovel();
      }
    );
  }

  ngOnDestroy() {
    if (!this.authService.currentUser?.id || !this.novel?.id) {
      return;
    }
    const collaborationMessageRequest: CollaborationMessageRequest = {
      type: CollaborationMessageTypeRequest.LeaveNovel,
      userId: this.authService.currentUser?.id,
      novelId: this.novel.id,
    };
    this.collaborationService.send(collaborationMessageRequest);
    if (this.autosaveSubscription) {
      this.autosaveSubscription.unsubscribe();
    }
  }

  fetchInitialData(): Observable<
    never[] | [Novel, CollaboratorDTO, MessageData]
  > {
    return this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      switchMap((novelId) => this.novelService.buildWithId(novelId)),
      switchMap((novel) => {
        if (!novel.id || !this.authService.currentUser?.id) {
          return of([]);
        }

        const novelObservable: Observable<Novel> = of(novel);

        const collaboratorObservable: Observable<CollaboratorDTO> =
          this.collaboratorService.findByNovelIdAndUserId(
            novel.id,
            this.authService.currentUser?.id
          );

        const messageObservable: Observable<MessageData> = this.messageService
          .findByNovelId(novel.id, 1, this.messagesSort)
          .pipe(
            map((response) => ({
              messages: response._embedded.messages,
              page: response.page,
            })),
            switchMap(({ messages, page }) => {
              if (!messages.length) {
                const messages: Message[] = [];
                return of({ messages, page });
              }
              const observables = messages.map((messageData) =>
                this.messageService.build(messageData)
              );
              return forkJoin(observables).pipe(
                map((messages) => ({ messages, page }))
              );
            })
          );
        return forkJoin([
          novelObservable,
          collaboratorObservable,
          messageObservable,
        ]);
      })
    );
  }

  receiveSendMessageInChat(message: CollaborationMessageResponse) {
    if (message.messageId) {
      this.messageService.buildWithId(message.messageId).subscribe({
        next: (message: Message) => {
          this.messages.push(message);
        },
      });
    }
  }

  receiveUpdateOnlineUsersRes(message: CollaborationMessageResponse) {
    if (message.userIds) {
      forkJoin(
        message.userIds.map((userId) => this.userService.findOne(userId))
      )
        .pipe(
          map((userDataArray: UserDTO[]) =>
            userDataArray.map((userData: UserDTO) => new User(userData))
          )
        )
        .subscribe({
          next: (users: User[]) => {
            this.onlineUsers = users;
            const index = this.onlineUsers.findIndex(
              (item) => item.id === this.authService.currentUser?.id
            );
            if (index !== -1) {
              this.onlineUsers.splice(index, 1);
            }
          },
        });
    }
  }

  // ###################################################################################
  setUpEditor() {
    if (!this.novel) {
      return;
    }
    this.editor = new Quill('#editor', {
      theme: 'snow',
      readOnly: this.readOnly,
      modules: {
        toolbar: this.toolbarOptions,
      },
    });
    this.editor.focus();
    this.editor.setText(this.novel.content);
    this.editor.on('text-change', () => {
      if (this.novel?.content !== this.editor.getText()) {
        this.isSaved = false;
      }
    });
  }

  saveChanges() {
    if (!this.novel || this.novel?.content === this.editor.getText()) {
      return;
    }
    const oldContent = this.novel.content;
    this.novel.content = this.editor.getText();
    this.novelService.update(this.novel.getData()).subscribe(() => {
      if (this.novel) {
        // this.sendEditNovelReq(oldContent, this.novel.content);
        this.isSaved = true;
      }
    });
  }

  receiveEditNovelRes(message: CollaborationMessageResponse) {
    if (message.content && this.novel?.content) {
      const patch = this.dmp.patch_fromText(message.content);
      const [patchedText] = this.dmp.patch_apply(patch, this.novel.content);
      if (patchedText) {
        console.log('###');
        console.log('patchedText:' + patchedText);
        console.log('this.novel.content:' + this.novel.content);
        console.log('this.editor.getText():' + this.editor.getText());
        this.editor.setText(patchedText);
        // this.saveChanges();
      }
    }
  }

  sendEditNovelReq(oldContent: string, newContent: string) {
    if (
      !this.authService.currentUser?.id ||
      !this.novel?.id ||
      oldContent === newContent
    ) {
      return;
    }
    const diffs = this.dmp.diff_main(oldContent, newContent);
    this.dmp.diff_cleanupSemantic(diffs);
    const patch = this.dmp.patch_make(
      this.novel.content,
      this.editor.getText(),
      diffs
    );
    const patchText = this.dmp.patch_toText(patch);
    const collaborationMessageRequest: CollaborationMessageRequest = {
      type: CollaborationMessageTypeRequest.EditNovel,
      userId: this.authService.currentUser?.id,
      novelId: this.novel.id,
      content: patchText,
    };
    this.collaborationService.send(collaborationMessageRequest);
  }
  // ###################################################################################

  subscribeCollaborationWebSocket() {
    this.collaborationService
      .onMessage()
      .subscribe((message: CollaborationMessageResponse) => {
        // console.log('Received message from server:', message);
        switch (message.type) {
          case CollaborationMessageTypeResponse.UpdateOnlineUsers:
            this.receiveUpdateOnlineUsersRes(message);
            break;
          case CollaborationMessageTypeResponse.EditNovel:
            this.receiveEditNovelRes(message);
            break;
          case CollaborationMessageTypeResponse.SendMessageInChat:
            this.receiveSendMessageInChat(message);
            break;
          default:
            break;
        }
      });
  }

  subscribeGetNovel() {
    // this.getNovelSubscription = interval(
    //   this.getNovelIntervalMiliSec
    // ).subscribe(() => {
    //   if (this.novel?.id) {
    //     this.novelService.findOne(this.novel.id).subscribe({
    //       next: (novelData: NovelDTO) => {
    //         this.editor.setText(novelData.content);
    //       },
    //     });
    //   }
    // });
    //apply all response[] gathered in the last 5s
  }

  subscribeAutosaveIfEnabled() {
    if (this.autosaveEnabled) {
      this.autosaveSubscription = interval(
        this.autosaveIntervalMiliSec
      ).subscribe(() => {
        this.saveChanges();
      });
    } else if (this.autosaveSubscription) {
      this.autosaveSubscription.unsubscribe();
    }
  }

  appendSuggestion() {
    if (this.novel?.content === undefined) {
      return;
    }
    const novelContent = `${this.editor.getText().trimEnd()} ${
      this.aiSuggestion
    }`;
    this.editor.setText(novelContent);
  }

  generateSuggestion() {
    if (this.novel?.content === undefined) {
      return;
    }
    this.suggestionOptions.inputLength = Number(
      this.suggestionOptions.inputLength
    );
    this.suggestionOptions.suggestionLength = Number(
      this.suggestionOptions.suggestionLength
    );

    this.generatingSuggestion = true;
    const latestContent = this.editor
      .getText()
      .slice(-this.suggestionOptions.inputLength);
    const aiRequest: AiRequest = {
      prompt: latestContent,
      length: this.suggestionOptions.suggestionLength,
    };
    this.aiService.generate(aiRequest).subscribe({
      next: (response: AiResponse) => {
        this.aiSuggestion = response.suggestion;
        this.generatingSuggestion = false;
      },
    });
  }

  // @HostListener('document:keydown', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   if (event.ctrlKey && event.key === 's') {
  //     event.preventDefault();
  //     this.saveChanges();
  //   }
  // }

  // @HostListener('window:beforeunload', ['$event'])
  // beforeUnloadHandler(event: Event) {
  //   this.ngOnDestroy();
  //   return confirm('Are you sure you want to leave?');
  // }

  showShareNovelDialog() {
    const dialogRef = this.dialog.open(ShareNovelDialogComponent, {
      width: '600px',
      height: 'auto',
      data: this.novel,
    });
  }

  toggleAi() {
    this.showAi = !this.showAi;
  }

  toggleChat() {
    this.showChat = !this.showChat;
  }

  toggleAutosave() {
    this.autosaveEnabled = !this.autosaveEnabled;
    this.subscribeAutosaveIfEnabled();
  }

  toggleSuggestionOptions() {
    this.showSuggestionOptions = !this.showSuggestionOptions;
  }

  editTitle(): void {
    this.editingTitle = true;
    setTimeout(() => {
      this.titleInput.nativeElement.select();
    });
  }

  updateTitle(newTitle: string) {
    if (!this.novel) {
      return;
    }
    this.novel.title = newTitle;
    this.editingTitle = false;
    this.novelService.update(this.novel.getData()).subscribe();
  }

  cancelTitleEditing() {
    this.editingTitle = false;
  }

  sendMessage() {
    if (!this.authService.currentUser?.id || !this.novel?.id) {
      return;
    }

    const messageData: MessageDTO = {
      userId: this.authService.currentUser.id,
      novelId: this.novel.id,
      content: this.messageContent,
    };

    this.messageService
      .create(messageData)
      .pipe(
        mergeMap((messageData: MessageDTO) => {
          return this.messageService.build(messageData);
        })
      )
      .subscribe({
        next: (message: Message) => {
          this.messages.push(message);
          if (this.authService.currentUser?.id && this.novel?.id) {
            const collaborationMessageRequest: CollaborationMessageRequest = {
              type: CollaborationMessageTypeRequest.SendMessageInChat,
              userId: this.authService.currentUser?.id,
              novelId: this.novel.id,
              messageId: message.id,
            };
            this.collaborationService.send(collaborationMessageRequest);
          }
          this.messageContent = '';
        },
      });
  }
}
