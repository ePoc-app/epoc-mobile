import {Injectable}  from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {OnboardingItem} from '../classes/onboarding';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  private _onboarding : OnboardingItem[];
  private onboardingSubject$ = new ReplaySubject<OnboardingItem[]>(1);
  onboarding$ = this.onboardingSubject$.asObservable();

  private removedOnboarding = JSON.parse(localStorage.getItem('removedOnboarding')) || [];

  private onboardingUrl = 'https://learninglab.gitlabpages.inria.fr/epoc/epocs/onboarding.json';
  constructor(private http: HttpClient) {
    this.http.get(this.onboardingUrl).subscribe((data: OnboardingItem[]) => {
      this.onboarding = data.filter(message => this.removedOnboarding.indexOf(message.id) === -1);
    });
  }

  get onboarding(): OnboardingItem[] {
    return this._onboarding;
  }

  set onboarding(value: OnboardingItem[]) {
    this._onboarding = value;
    this.onboardingSubject$.next(value);
  }

  remove(id) {
    this.onboarding = this.onboarding.filter((message) => message.id !== id)
    this.removedOnboarding.push(id);
    localStorage.setItem('removedOnboarding', JSON.stringify(this.removedOnboarding))
  }
}
