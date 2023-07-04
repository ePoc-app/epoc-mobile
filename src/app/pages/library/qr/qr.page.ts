import { Component, OnInit } from '@angular/core';
import {BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';
import { AlertController } from '@ionic/angular';
import {Router} from '@angular/router';
import {LocalEpocsService} from 'src/app/services/localEpocs.service';

@Component({
  selector: 'app-epoc-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class EpocQrPage implements OnInit {

  constructor(
      private alertController: AlertController,
      private router: Router,
      public localEpocsService: LocalEpocsService
  ) { }

  async ngOnInit() {
    await this.startScan();
  }

  async didUserGrantPermission() {
    const status = await BarcodeScanner.checkPermission({ force: true });

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

  async startScan() {
    const allowed = await this.didUserGrantPermission();
    if (!allowed) this.router.navigateByUrl('library');

    await BarcodeScanner.hideBackground();
    document.body.classList.add('qr-scan')

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
      header: 'Confirmation',
      subHeader: `Importation de l'ePoc ${url}`,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            this.startScan();
          },
        },
        {
          text: 'Confirmer',
          role: 'confirm',
          handler: () => {
            this.localEpocsService.downloadLocalEpoc(url);
            this.router.navigate(['/library']);
          },
        },
      ],
    });

    await alert.present();
  }
}
