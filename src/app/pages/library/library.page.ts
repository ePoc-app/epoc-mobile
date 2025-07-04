import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LibraryService} from 'src/app/services/library.service';
import {CustomLibrary, EpocLibrary} from 'src/app/classes/epoc';
import {OnboardingService} from '../../services/onboarding.service';
import {OnboardingItem} from '../../classes/onboarding';
import {AppService} from 'src/app/services/app.service';
import {TranslateService} from '@ngx-translate/core';
import {ActionSheetController, AlertController, IonicSlides} from '@ionic/angular';
import {LocalEpocsService} from '../../services/localEpocs.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
})
export class LibraryPage implements OnInit {
  @ViewChild('file', {static: false}) fileRef: ElementRef;
  swiperModules = [IonicSlides];

  localEpocs: EpocLibrary[] | undefined;
  onboarding: OnboardingItem[];

  onboardingOptions = {
    slidesPerView: 1,
    spaceBetween: 16,
  }

  constructor(
      private ref: ChangeDetectorRef,
      private router: Router,
      public libraryService: LibraryService,
      public onboardingService: OnboardingService,
      public appService: AppService,
      public translate: TranslateService,
      public actionSheetController: ActionSheetController,
      public alertController: AlertController,
      public localEpocsService: LocalEpocsService
  ) {}

  ngOnInit() {
    this.localEpocsService.fetchLocalEpocs();
    this.onboardingService.onboarding$.subscribe((data => {
      this.onboarding = data;
    }))
  }

  downloadEpoc(epoc: EpocLibrary, libraryId?: string) {
    this.libraryService.downloadEpoc(epoc, libraryId);
  }

  removeMessage(id) {
    this.onboardingService.remove(id);
  }

  doRefresh(event) {
    const startTime = performance.now();
    this.libraryService.fetchCustomCollections();
    this.localEpocsService.fetchLocalEpocs();
    this.libraryService.officialCollections$.subscribe(() => {
      const endTime = performance.now();
      const delay = Math.max(0, 500 - (endTime - startTime)); // minimum delay of 500ms
      setTimeout(() => {
        event.target.complete();
      }, delay);
    });
  }

  async openEpocMenu(epoc, libraryId?: string){
    await this.libraryService.epocLibraryMenu(epoc, libraryId);
  }
  async openAddMenu() {
    const buttons = [
      {
        text: this.translate.instant('FLOATING_MENU.IMPORT_FILE'),
        icon: '/assets/icon/importer.svg',
        handler: () => {
          this.fileRef.nativeElement.click();
        }
      },
      {
        text: this.translate.instant('FLOATING_MENU.IMPORT_LINK'),
        icon: '/assets/icon/lien.svg',
        handler: () => {
          this.linkInputAlert();
        }
      },
      {
        text: this.translate.instant('FLOATING_MENU.IMPORT_QR'),
        icon: '/assets/icon/qr.svg',
        handler: () => {
          this.router.navigateByUrl('/library/qr')
        }
      },
      {
        text: 'Fermer',
        role: 'cancel'
      }
    ];
    const actionSheet = await this.actionSheetController.create({
      header: '',
      cssClass: 'custom-action-sheet',
      mode: 'ios',
      buttons
    });
    await actionSheet.present();
  }

  fileHandler(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.localEpocsService.importFile(file);
    this.fileRef.nativeElement.value = '';
  }

  async linkInputAlert() {
    const alert = await this.alertController.create({
      header: 'Saisissez le lien du fichier ePoc que vous souhaitez importer',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Importer',
          handler: (e) => {
            this.localEpocsService.downloadLocalEpoc(e.link);
          }
        }
      ],
      inputs: [
        {
          name: 'link',
          placeholder: 'Saisissez le lien',
        }
      ],
    });

    await alert.present();
  }

  ionViewDidEnter() {
    if(this.appService.screenReaderDetected) {
      const content = document.querySelector('.library-items') as HTMLElement;
      content.focus();
    }
  }

  protected readonly Object = Object;
}
