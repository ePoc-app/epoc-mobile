import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Badge} from 'src/app/classes/epoc';

@Component({
  selector: 'badge-modal',
  templateUrl: './badge-modal.component.html',
  styleUrls: ['./badge-modal.component.scss'],
})
export class BadgeModalComponent implements OnInit {
  @Input() showModal: boolean;
  @Input() badge: Badge;

  @Output() dismiss = new EventEmitter<boolean>();


  constructor() {}

  ngOnInit() {
  }

  hide() {
    console.log(this.badge);
    this.dismiss.emit(true);
  }

}
