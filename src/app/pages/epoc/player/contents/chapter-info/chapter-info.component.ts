import {Component, Input, OnInit} from '@angular/core';
import {Chapter} from 'src/app/classes/epoc';

@Component({
  selector: 'chapter-info',
  templateUrl: './chapter-info.component.html',
  styleUrls: ['./chapter-info.component.scss'],
})
export class ChapterInfoComponent implements OnInit {

  @Input() chapter : Chapter;

  constructor() { }

  ngOnInit() {}

}
