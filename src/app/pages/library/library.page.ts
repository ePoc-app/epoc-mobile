import { Component, OnInit } from '@angular/core';
import {LibraryService} from 'src/app/services/library.service';
import {Epoc, EpocMetadata} from 'src/app/classes/epoc';
import {FileService} from 'src/app/services/file.service';
import {distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
})
export class LibraryPage implements OnInit {

  library: EpocMetadata[] | undefined;
  downloadedEpocs: string[] = [];

  constructor(public libraryService: LibraryService, private fileService: FileService) { }

  ngOnInit() {
    this.libraryService.getLibrary().subscribe((data: EpocMetadata[]) => this.library = data);
    this.fileService.readdir().subscribe((data: string[]) => this.downloadedEpocs = data)
  }

  downloadEpoc(epoc: EpocMetadata) {
    this.fileService.download(epoc.download, epoc.id+'.zip').pipe(
        distinctUntilChanged()
    ).subscribe((progress) => console.log(progress + '%'))
  }

  deleteEpoc(epoc: EpocMetadata) {
    this.fileService.delete(epoc.id+'.zip');
  }
}
