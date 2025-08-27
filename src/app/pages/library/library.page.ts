import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LibraryService} from 'src/app/services/library.service';
import {EpocCollection, EpocLibrary} from 'src/app/classes/epoc';
import {OnboardingService} from 'src/app/services/onboarding.service';
import {OnboardingItem} from 'src/app/classes/onboarding';
import {AppService} from 'src/app/services/app.service';
import {TranslateService} from '@ngx-translate/core';
import {ActionSheetController, AlertController, IonicSlides} from '@ionic/angular';
import {LocalEpocsService} from 'src/app/services/localEpocs.service';
import {Router} from '@angular/router';
import {combineLatest} from 'rxjs';
import {uid} from '@epoc/epoc-types/src/v1';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
})
export class LibraryPage implements OnInit {
  @ViewChild('file', {static: false}) fileRef: ElementRef;
  swiperModules = [IonicSlides];

  collections: Record<uid, EpocCollection>;
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
    combineLatest([
      this.libraryService.officialCollections$,
      this.libraryService.customCollections$
    ]).subscribe(([officialCollections, customCollections]) => {
      this.collections = {...customCollections, ...officialCollections};
    });

    this.onboardingService.onboarding$.subscribe((data => {
      this.onboarding = data;
    }))
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
  async openAddMenu() {
    const buttons = [
      {
        text: 'ePoc',
        cssClass: 'separator'
      },
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
        text: this.translate.instant('FLOATING_MENU.COLLECTION'),
        cssClass: 'separator'
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
      header: this.translate.instant('FLOATING_MENU.IMPORT'),
      subHeader: this.translate.instant('FLOATING_MENU.IMPORT_SUBHEADER'),
      cssClass: 'custom-action-sheet import-action-sheet',
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
      header: this.translate.instant('FLOATING_MENU.IMPORT_FROM_LINK'),
      buttons: [
        {
          text: this.translate.instant('CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translate.instant('CONFIRM'),
          handler: (e) => {
            if (e.link.endsWith('.json')) this.libraryService.addCustomCollection(e.link);
            else this.localEpocsService.downloadLocalEpoc(e.link);
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
}
