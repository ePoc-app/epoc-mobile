import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {Capacitor} from '@capacitor/core';
import {Filesystem,Directory, Encoding} from '@capacitor/filesystem';
import {Chapter, Epoc} from 'src/app/classes/epoc';
import {HttpClient} from '@angular/common/http';
import {File} from '@ionic-native/file/ngx';
import {Router} from '@angular/router';
import {ActionSheetController, AlertController} from '@ionic/angular';
import {AppService} from './app.service';
import {TranslateService} from '@ngx-translate/core';
import {uid} from '@epoc/epoc-types/dist/v1';
import {Content} from '../classes/contents/content';


@Injectable({
    providedIn: 'root'
})
export class EpocService {
  private initialized = false;
  private storedRootFolder = localStorage.getItem('rootFolder');
  public rootFolder =  Capacitor.convertFileSrc(this.storedRootFolder);

  private _epoc : Epoc;
  private epocSubject$ = new ReplaySubject<Epoc>(1);
  epoc$ = this.epocSubject$.asObservable();

  constructor(
      private http: HttpClient,
      private file: File,
      private router: Router,
      public alertController: AlertController,
      public actionSheetController: ActionSheetController,
      public appService: AppService,
      public translate: TranslateService
  ) {}

  get epoc(): Epoc {
    return this._epoc;
  }

  set epoc(value: Epoc) {
    this._epoc = value;
    this.epocSubject$.next(value);
  }

  setRootFolder(rootFolder: string) {
    localStorage.setItem('rootFolder', rootFolder);
    this.rootFolder = Capacitor.convertFileSrc(rootFolder);
  }

  getEpoc(id: string): Observable<Epoc> {
    if (this._epoc && this._epoc.id === id) return this.epoc$;
    this.findEpocDir(id).then(dir => {
      if (!dir) return;
      this.setRootFolder(`${this.file.dataDirectory ? this.file.dataDirectory : 'assets/demo/'}${dir}/${id}/`);
      this.http.get<Epoc>(`${this.rootFolder}content.json`).subscribe((data) => {
        const epoc = data;
        if (epoc.id !== id) epoc.id = id; // Fix id when local epocs are imported
        this.epoc = this.initCourseContent(epoc);
      }, () => {
        // Backup support for iOS livereload (dev environment)
        Filesystem.readFile({
          path: `../Library/NoCloud/${dir}/${id}/content.json`,
          directory: Directory.Data,
          encoding: Encoding.UTF8
        }).then((result) => {
          const epoc = JSON.parse(result.data);
          if (epoc.id !== id) epoc.id = id; // Fix id when local epocs are imported
          this.epoc = this.initCourseContent(epoc as Epoc);
        });
      });
    })
    return this.epoc$;
  }

  /**
   * Find in which directory is the epoc stored
   * @param id The unique id of an ePoc directory
   */
  async findEpocDir(id: string): Promise<string | null> {
    if (!Capacitor.isNativePlatform()) return 'epocs'
    const dirs = await this.file.listDir(this.file.dataDirectory, '');
    for (const dir of dirs) {
      if (dir.isDirectory) {
        try {
          await this.file.checkFile(this.file.dataDirectory, `${dir.name}/${id}/content.json`);
          return dir.name;
        } catch {}
      }
    }
    return null;
  }

  /**
   * Initiliaze ePoc runtime properties
   */
  initCourseContent(epoc: Epoc) {
    this.initialized = true;
    epoc.assessments = [];
    // backward compatibility before epoc parameters existed
    epoc.parameters = epoc.parameters ? epoc.parameters : {};

    for (const [chapterId, chapter] of Object.entries(epoc.chapters)) {
      chapter.resumeLink = `/epoc/play/${epoc.id}/${chapterId}`;
      chapter.time = 0;
      chapter.mediaCount = 0;
      chapter.assessments = [];
      chapter.initializedContents = chapter.contents.map((id) => {
        const currentContent: Content = epoc.contents[id];
        currentContent.id = id;
        if (currentContent.type === 'assessment') {
          currentContent.scoreTotal = this.calcScoreTotal(epoc, currentContent.questions);
          currentContent.chapterId = chapterId;
          chapter.time = chapter.time + currentContent.questions.length;
          chapter.assessments.push(id);
          if (currentContent.scoreTotal > 0) {
            epoc.assessments.push(currentContent);
          }
        } else if (currentContent.type === 'simple-question' &&
            Number(epoc.questions[currentContent.question].score) > 0) {
          currentContent.scoreTotal = this.calcScoreTotal(epoc, [currentContent.question]);
          currentContent.questions = [currentContent.question];
          currentContent.chapterId = chapterId;
          chapter.assessments.push(id);
          epoc.assessments.push(currentContent);
        } else if (currentContent.type === 'video' || currentContent.type === 'audio') {
          chapter.mediaCount++;
          chapter.time = chapter.time + 3;
        }
        return currentContent;
      });
      chapter.assessmentCount = chapter.assessments.length;
    }

    return epoc;
  }

  /**
   * Calcule le score total d'un ensemble de questions
   */
  public calcScoreTotal(epoc: Epoc, questions: Array<uid>) {
    return questions.reduce((total, questionId) => total + Number(epoc.questions[questionId].score), 0);
  }

  /**
   * Calcule le score d'une question en fonction des réponses d'un apprenant
   */
  public calcScore(scoreMax, correction, userResponses) {
    return this.isUserResponsesCorrect(correction, userResponses) ? +scoreMax : 0;
  }

  /**
   * Check if the learner responses is correct
   */
  public isUserResponsesCorrect(correction, userResponses) {
    if (typeof correction === 'string') {
      return userResponses.join('') === correction;
    } else {
      correction = correction as Array<any>;
      if (correction.length > 0 && correction[0].values){
        return correction.every((group, index) => {
          return JSON.stringify(group.values.sort()) === JSON.stringify(userResponses[index].map(r => r.value).sort())
        });
      } else {
        return JSON.stringify(correction.sort()) === JSON.stringify(userResponses.sort());
      }
    }
  }

  async epocMainMenu(chapterIndex?:number, chapter?:Chapter) {
    const buttons = [
      {
        text: this.translate.instant('FLOATING_MENU.HOME'),
        icon: 'home-outline',
        handler: () => {
          this.router.navigateByUrl('/home/' + this.epoc.id);
        }
      },
      ...(!this.router.isActive('/epoc/toc/' + this.epoc.id, true) ? [{
        text: this.translate.instant('FLOATING_MENU.TOC'),
        icon: 'list-circle-outline',
        handler: () => {
          this.router.navigateByUrl('/epoc/toc/' + this.epoc.id);
        }
      }] : []),
      {
        text: this.translate.instant('FLOATING_MENU.SCORE_DETAILS'),
        icon: 'star-outline',
        handler: () => {
          this.router.navigateByUrl('/epoc/score/' + this.epoc.id);
        }
      },
      {
        text: this.translate.instant('FLOATING_MENU.LICENSE'),
        icon: 'receipt-outline',
        handler: () => {
          this.appService.displayLicence(this.epoc)
        }
      },
      {
        text: this.translate.instant('FLOATING_MENU.COMMENT'),
        icon: 'chatbox-ellipses-outline',
        handler: () => {
          this.appService.leaveComment(this.epoc.id)
        }
      },
      {
        text: this.translate.instant('FLOATING_MENU.SETTINGS'),
        icon: 'settings-outline',
        handler: () => {
          this.router.navigateByUrl('/settings');
        }
      },
      {
        text: this.translate.instant('CLOSE'),
        role: 'cancel'
      }
    ];
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'custom-action-sheet',
      mode: 'ios',
      header: this.epoc.title,
      subHeader: chapter && chapter.title ? `${chapterIndex  + 1}. ${chapter.title}` : '',
      buttons
    });
    await actionSheet.present();
  }
}
