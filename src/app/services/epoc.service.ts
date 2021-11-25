import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {Capacitor, FilesystemDirectory, FilesystemEncoding, Plugins} from '@capacitor/core';
import {Epoc} from 'src/app/classes/epoc';
import {uid} from 'src/app/classes/types';
import {Assessment, SimpleQuestion} from 'src/app/classes/contents/assessment';
import {HttpClient} from '@angular/common/http';
import {File} from '@ionic-native/file/ngx';
const {Filesystem} = Plugins;

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
      private file: File
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
        directory: FilesystemDirectory.Data,
        encoding: FilesystemEncoding.UTF8
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
          epoc.assessments.push((currentContent as Assessment));
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
}
