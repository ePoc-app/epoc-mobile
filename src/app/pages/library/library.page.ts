import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LibraryService} from 'src/app/services/library.service';
import {EpocLibrary} from 'src/app/classes/epoc';
import {ActionSheetController} from '@ionic/angular';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
})
export class LibraryPage implements OnInit {

  library: EpocLibrary[] | undefined;
  epocProgresses : {[EpocId: string] : number} = {};

  constructor(
      private ref: ChangeDetectorRef,
      public libraryService: LibraryService,
      public actionSheetController: ActionSheetController,
  ) {}

  ngOnInit() {
    this.libraryService.library$.subscribe((data: EpocLibrary[]) => { this.library = data; });
    this.libraryService.epocProgresses$.subscribe((epocProgresses) => {
      this.epocProgresses = epocProgresses;
      this.ref.detectChanges();
    });
  }

  downloadEpoc(epoc: EpocLibrary) {
    this.libraryService.downloadEpoc(epoc);
  }

  deleteEpoc(epoc: EpocLibrary) {
    this.libraryService.deleteEpoc(epoc);
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
      cssClass: 'custom-action-sheet',
      mode: 'ios',
      buttons
    });
    await actionSheet.present();
  }
}
