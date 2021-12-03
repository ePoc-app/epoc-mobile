import { Component, OnInit } from '@angular/core';
import {AbstractActivityContainerComponent} from '../abstract-activity-container.component';

@Component({
  selector: 'thoughts',
  templateUrl: './thoughts.component.html',
  styleUrls: ['./thoughts.component.scss'],
})
export class ThoughtsComponent extends AbstractActivityContainerComponent {

  constructor() {
    super();
  }
}
