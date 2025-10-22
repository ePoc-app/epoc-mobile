import { Component, OnInit } from '@angular/core';
import {BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';
import { AlertController } from '@ionic/angular';
import {Router} from '@angular/router';
import {LocalEpocsService} from 'src/app/services/localEpocs.service';
import {LibraryService} from 'src/app/services/library.service';
import {Capacitor} from '@capacitor/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-epoc-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class EpocQrPage {

  unsupported = false;
  scanning = false;

  constructor(
      private alertController: AlertController,
      private router: Router,
      public translate: TranslateService,
      public localEpocsService: LocalEpocsService,
      public libraryService: LibraryService,
  ) { }

  async ionViewDidEnter() {
    if (!Capacitor.isNativePlatform()) {
      this.unsupported = true;
      this.scanning = true;
      return;
    }
    await this.startScan();
  }

  async didUserGrantPermission() {
    const status = await BarcodeScanner.checkPermission({ force: true });
    console.log(status)
    if (status.granted) {
      return true;
    }

    if (status.denied) {
      await this.checkSettings();
    }

    if (status.asked) {
      // system requested the user for permission during this call
      // only possible when force set to true
    }

    if (status.restricted || status.unknown) {
      // ios only
      // probably means the permission has been denied
      return false;
    }

    // user did not grant the permission, so he must have declined the request
    return false;
  };

  ionViewWillLeave() {
    this.scanning = false;
    if (!Capacitor.isNativePlatform()) return;
    BarcodeScanner.showBackground().then();
    BarcodeScanner.stopScan().then();
    document.body.classList.remove('qr-scan');
  }

  async startScan() {
    this.scanning = true;
    const allowed = await this.didUserGrantPermission();
    // if (!allowed) this.router.navigateByUrl('library');
    console.log(allowed)
    await BarcodeScanner.hideBackground();
    document.body.classList.add('qr-scan');

    const result = await BarcodeScanner.startScan({ targetedFormats: [SupportedFormat.QR_CODE] });

    if (result.hasContent) {
      await this.confirmOpen(result.content);
    }
  }

  async checkSettings() {
    const alert = await this.alertController.create({
      header: 'Autoriser la caméra',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
        },
        {
          text: 'Confirmer',
          role: 'confirm',
          handler: () => {
            BarcodeScanner.openAppSettings();
            this.startScan();
          },
        },
      ],
    });

    await alert.present();
  }

  async confirmOpen(url) {
    const alert = await this.alertController.create({
      header: this.translate.instant('CONFIRM'),
      subHeader: `${this.translate.instant('LIBRARY_PAGE.IMPORT')} ${url} ?`,
      buttons: [
        {
          text: this.translate.instant('CANCEL'),
          role: 'cancel',
          handler: () => {
            this.startScan();
          },
        },
        {
          text: this.translate.instant('CONFIRM'),
          role: 'confirm',
          handler: () => {
            if (url.endsWith('.json')) this.libraryService.addCustomCollection(url);
            else this.localEpocsService.downloadLocalEpoc(url);
            this.router.navigate(['/library']);
          },
        },
      ],
    });

    await alert.present();
  }
}
