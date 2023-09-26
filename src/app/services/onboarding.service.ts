import {Injectable}  from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {OnboardingItem} from '../classes/onboarding';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  private _onboarding : OnboardingItem[];
  private onboardingSubject$ = new ReplaySubject<OnboardingItem[]>(1);
  onboarding$ = this.onboardingSubject$.asObservable();

  private removedOnboarding = JSON.parse(localStorage.getItem('removedOnboarding')) || [];

  private onboardingUrls = {
    fr : 'https://learninglab.gitlabpages.inria.fr/epoc/epocs/onboarding.json',
    en : 'https://learninglab.gitlabpages.inria.fr/epoc/epocs/onboarding-en.json'
  };
  constructor(
    private http: HttpClient,
    public translate: TranslateService
  ) {
    this.fetch(this.translate.currentLang);
    this.translate.onLangChange.subscribe(event => {
      this.fetch(event.lang)
    })
  }

  get onboarding(): OnboardingItem[] {
    return this._onboarding;
  }

  set onboarding(value: OnboardingItem[]) {
    this._onboarding = value;
    this.onboardingSubject$.next(value);
  }

  fetch(lang){
    this.http.get(this.onboardingUrls[this.onboardingUrls[lang] ? lang : 'fr']).subscribe((data: OnboardingItem[]) => {
      this.onboarding = data.filter(message => this.removedOnboarding.indexOf(message.id) === -1);
    });
  }

  remove(id) {
    this.onboarding = this.onboarding.filter((message) => message.id !== id)
    this.removedOnboarding.push(id);
    localStorage.setItem('removedOnboarding', JSON.stringify(this.removedOnboarding))
  }
}
