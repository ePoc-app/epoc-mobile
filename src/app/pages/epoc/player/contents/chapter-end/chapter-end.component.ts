import {Component, Input, OnInit} from '@angular/core';
import {EpocService} from 'src/app/services/epoc.service';
import {Chapter, Epoc} from 'src/app/classes/epoc';
import {AppService} from '../../../../../services/app.service';

@Component({
  selector: 'chapter-end',
  templateUrl: './chapter-end.component.html',
  styleUrls: ['./chapter-end.component.scss'],
})
export class ChapterEndComponent implements OnInit {

  @Input() epoc : Epoc;
  @Input() chapter : Chapter;
  @Input() nextChapter : Chapter;
  @Input() chapterLabel : string;

  constructor() { }

  ngOnInit() {}
}
