import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LibraryService} from 'src/app/services/library.service';
import {EpocLibrary} from 'src/app/classes/epoc';
import {ActionSheetController, AlertController} from '@ionic/angular';
import {OnboardingService} from '../../services/onboarding.service';
import {OnboardingItem} from '../../classes/onboarding';
import {Router} from '@angular/router';

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
      private router: Router,
      public alertController: AlertController
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

  ionViewDidEnter() {
    this.libraryService.fetchLibrary();
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
        text: 'Table des matières',
        icon: 'list-circle-outline',
        handler: () => {
          this.router.navigateByUrl('/epoc/toc/' + epoc.id);
        }
      },
      {
        text: 'Scores & attestation',
        icon: 'star-outline',
        handler: () => {
          this.router.navigateByUrl('/epoc/score/' + epoc.id);
        }
      },
      {
        text: 'Supprimer',
        icon: 'trash',
        handler: () => {
          this.confirmDelete(epoc)
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

  async confirmDelete(epoc) {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: `Merci de confimer la suppresion de l'ePoc <b>"${epoc.title}"</b>`,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Confirmer',
          handler: () => {
            this.deleteEpoc(epoc);
          }
        }
      ]
    });

    await alert.present();
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
}
