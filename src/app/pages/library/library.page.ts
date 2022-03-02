import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LibraryService} from 'src/app/services/library.service';
import {EpocLibrary} from 'src/app/classes/epoc';
import {ActionSheetController} from '@ionic/angular';
import {OnboardingService} from '../../services/onboarding.service';
import {OnboardingItem} from '../../classes/onboarding';

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
    spaceBetween: 16
  }

  constructor(
      private ref: ChangeDetectorRef,
      public libraryService: LibraryService,
      public onboardingService: OnboardingService,
      public actionSheetController: ActionSheetController,
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

  deleteEpoc(epoc: EpocLibrary) {
    this.libraryService.deleteEpoc(epoc);
  }

  removeMessage(id) {
    this.onboardingService.remove(id);
  }

  async presentActionSheet(epoc) {
    const buttons = [
      {
        text: 'Supprimer',
        icon: 'trash',
        handler: () => {
          this.deleteEpoc(epoc);
        }
      },
      {
        text: 'Fermer',
        role: 'cancel'
      }
    ];
    const actionSheet = await this.actionSheetController.create({
      header: epoc.title,
      cssClass: 'custom-action-sheet',
      mode: 'ios',
      buttons
    });
    await actionSheet.present();
  }

  doRefresh(event) {
    const startTime = performance.now();
    this.libraryService.fetchLibrary();
    this.libraryService.library$.subscribe((data: EpocLibrary[]) => {
      const endTime = performance.now();
      const delay = Math.max(0, 500 - (endTime - startTime)); // minimum delay of 500ms
      setTimeout(() => {
        event.target.complete();
      }, delay);
    });
  }
}
