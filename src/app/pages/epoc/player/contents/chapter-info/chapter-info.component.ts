import {Component, Input, OnInit} from '@angular/core';
import {Chapter} from 'src/app/classes/epoc';
import {EpocService} from 'src/app/services/epoc.service';

@Component({
  selector: 'chapter-info',
  templateUrl: './chapter-info.component.html',
  styleUrls: ['./chapter-info.component.scss'],
})
export class ChapterInfoComponent implements OnInit {

  @Input() chapter : Chapter;

  constructor(public epocService: EpocService) { }

  ngOnInit() {}

}
