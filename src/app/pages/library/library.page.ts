import { Component, OnInit } from '@angular/core';
import {LibraryService} from 'src/app/services/library.service';
import {Epoc, EpocMetadata} from '../../classes/epoc';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
})
export class LibraryPage implements OnInit {

  library: EpocMetadata[] | undefined;

  constructor(public libraryService: LibraryService) { }

  ngOnInit() {
    this.libraryService.getLibrary().subscribe((data: EpocMetadata[]) => this.library = [...data]);
  }

}
