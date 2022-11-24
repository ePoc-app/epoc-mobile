import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LibraryService} from 'src/app/services/library.service';
import {EpocLibrary} from 'src/app/classes/epoc';
import {OnboardingService} from '../../services/onboarding.service';
import {OnboardingItem} from '../../classes/onboarding';
import {AppService} from 'src/app/services/app.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
})
export class LibraryPage implements OnInit {

  library: EpocLibrary[] | undefined;
  onboarding: OnboardingItem[];
  epocProgresses : {[EpocId: string] : number} = {};

  onboardingOptions = {
    slidesPerView: 1,
    spaceBetween: 16,
  }

  constructor(
      private ref: ChangeDetectorRef,
      public libraryService: LibraryService,
      public onboardingService: OnboardingService,
      public appService: AppService,
  ) {}

  ngOnInit() {
    this.libraryService.library$.subscribe((data: EpocLibrary[]) => { this.library = data; });
    this.libraryService.epocProgresses$.subscribe((epocProgresses) => {
      this.epocProgresses = epocProgresses;
      this.ref.detectChanges();
    });
    this.onboardingService.onboarding$.subscribe((data => {
      this.onboarding = data;
    }))
  }

  downloadEpoc(epoc: EpocLibrary) {
    this.libraryService.downloadEpoc(epoc);
  }

  removeMessage(id) {
    this.onboardingService.remove(id);
  }

  doRefresh(event) {
    const startTime = performance.now();
    this.libraryService.fetchLibrary();
    this.libraryService.library$.subscribe(() => {
      const endTime = performance.now();
      const delay = Math.max(0, 500 - (endTime - startTime)); // minimum delay of 500ms
      setTimeout(() => {
        event.target.complete();
      }, delay);
    });
  }

  openEpocMenu(epoc){
    this.libraryService.epocLibraryMenu(epoc);
  }

  ionViewDidEnter() {
    if(this.appService.screenReaderDetected) {
      const content = document.querySelector('.library-items') as HTMLElement;
      content.focus();
    }
  }
}
