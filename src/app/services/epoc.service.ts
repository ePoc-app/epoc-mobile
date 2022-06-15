import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {Capacitor} from '@capacitor/core';
import { Filesystem,Directory, Encoding } from '@capacitor/filesystem';
import {Chapter, Epoc} from 'src/app/classes/epoc';
import {uid} from 'src/app/classes/types';
import {Assessment, SimpleQuestion} from 'src/app/classes/contents/assessment';
import {HttpClient} from '@angular/common/http';
import {File} from '@ionic-native/file/ngx';
import {Router} from '@angular/router';
import {ActionSheetController} from '@ionic/angular';


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
      public actionSheetController: ActionSheetController
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
    this.setRootFolder(`${this.file.dataDirectory ? this.file.dataDirectory : 'assets/demo/'}epocs/${id}/`);
    this.http.get<Epoc>(`${this.rootFolder}content.json`).subscribe((epoc) => {
      this.epoc = this.initCourseContent(epoc);
    }, () => {
      // Backup support for iOS livereload (dev environment)
      Filesystem.readFile({
        path: `../Library/NoCloud/epocs/${id}/content.json`,
        directory: Directory.Data,
        encoding: Encoding.UTF8
      }).then((result) => {
        const epoc = JSON.parse(result.data);
        this.epoc = this.initCourseContent(epoc as Epoc);
      });
    });
    return this.epoc$;
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
      chapter.videoCount = 0;
      chapter.assessments = [];
      chapter.initializedContents = chapter.contents.map((id) => {
        const currentContent = epoc.contents[id];
        currentContent.id = id;
        if (currentContent.type === 'assessment') {
          (currentContent as Assessment).scoreTotal = this.calcScoreTotal(epoc, (currentContent as Assessment).questions);
          (currentContent as Assessment).chapterId = chapterId;
          chapter.time = chapter.time + (currentContent as Assessment).questions.length;
          chapter.assessments.push(id);
          if ((currentContent as Assessment).scoreTotal > 0) {
            epoc.assessments.push((currentContent as Assessment));
          }
        } else if (currentContent.type === 'simple-question' &&
            Number(epoc.questions[(currentContent as SimpleQuestion).question].score) > 0) {
          (currentContent as Assessment).scoreTotal = this.calcScoreTotal(epoc, [(currentContent as SimpleQuestion).question]);
          (currentContent as Assessment).questions = [(currentContent as SimpleQuestion).question];
          (currentContent as Assessment).chapterId = chapterId;
          chapter.assessments.push(id);
          epoc.assessments.push((currentContent as Assessment));
        } else if (currentContent.type === 'video') {
          chapter.videoCount++;
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
    let score = 0;
    if (typeof correction === 'string') {
      score = userResponses.join('') === correction ? +scoreMax : score;
    } else {
      correction = correction as Array<any>;
      if (correction.length > 0 && correction[0].values){
        score = correction.every((group, index) => {
          return JSON.stringify(group.values.sort()) === JSON.stringify(userResponses[index].map(r => r.value).sort())
        }) ? +scoreMax : 0;
      } else {
        score = JSON.stringify(correction.sort()) === JSON.stringify(userResponses.sort())? +scoreMax : 0;
      }
    }
    return score;
  }

  async epocMainMenu(chapterIndex?:number, chapter?:Chapter) {
    const buttons = [
      {
        text: 'Accueil',
        icon: 'home-outline',
        handler: () => {
          this.router.navigateByUrl('/home/' + this.epoc.id);
        }
      },
      {
        text: 'À propos du cours',
        icon: 'information-circle-outline',
        handler: () => {
          this.router.navigateByUrl('/library/' + this.epoc.id);
        }
      },
      ...(!this.router.isActive('/epoc/toc/' + this.epoc.id, true) ? [{
        text: 'Table des matières',
        icon: 'list-circle-outline',
        handler: () => {
          this.router.navigateByUrl('/epoc/toc/' + this.epoc.id);
        }
      }] : []),
      {
        text: 'Détails des scores',
        icon: 'star-outline',
        handler: () => {
          this.router.navigateByUrl('/epoc/score/' + this.epoc.id);
        }
      },
      {
        text: 'Paramètres',
        icon: 'settings-outline',
        handler: () => {
          this.router.navigateByUrl('/settings');
        }
      },
      {
        text: 'Fermer',
        role: 'cancel'
      }
    ];
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'custom-action-sheet',
      mode: 'ios',
      header: this.epoc.title,
      subHeader: chapterIndex ? `${chapterIndex  + 1}. ${chapter.title}` : '',
      buttons
    });
    await actionSheet.present();
  }
}
