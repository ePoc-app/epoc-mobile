import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {AlertController, ToastController} from '@ionic/angular';

import {DemoLibrary, MockLibrary} from '../classes/mock-library';
import {Epoc} from '../classes/epoc';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  constructor(
      public alertController: AlertController,
      public toastController: ToastController
  ) { }

  getLibrary(): Observable<Epoc[]> {
    return of(MockLibrary);
  }

  async addItem() {
      if ( MockLibrary.length < DemoLibrary.length) {
          // Find one that's not already in MockedLibrary
          MockLibrary.push(DemoLibrary.find(demoEpoc => !MockLibrary.find(mockEpoc => mockEpoc.id === demoEpoc.id)));
      } else {
          const toast = await this.toastController.create({
              message: 'No more Epoc to add.',
              duration: 2000
          });
          toast.present();
      }
  }

  async addItemFromFile() {
      const toast = await this.toastController.create({
          message: 'Feature not available yet.',
          duration: 2000
      });
      toast.present();
  }

  async addItemFromUrl() {
      const toast = await this.toastController.create({
          message: 'Feature not available yet.',
          duration: 2000
      });
      const alert = await this.alertController.create({
          header: 'Download Epoc',
          inputs: [
              {
                  name: 'url',
                  type: 'text',
                  placeholder: 'Epoc download URL'
              }
          ],
          buttons: [
              {
                  text: 'Cancel',
                  role: 'cancel',
                  cssClass: 'secondary'
              }, {
                  text: 'Ok',
                  handler: (data) => {
                      toast.present();
                  }
              }
          ]
      });

      alert.present();
  }

  deleteItem(index: number) {
    MockLibrary.splice(index, 1);
  }
}
