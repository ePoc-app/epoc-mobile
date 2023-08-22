import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Badge} from 'src/app/classes/epoc';
import {Reading} from 'src/app/classes/reading';
import * as jsonLogic from 'json-logic-js/logic';

@Component({
  selector: 'badge-modal',
  templateUrl: './badge-modal.component.html',
  styleUrls: ['./badge-modal.component.scss'],
})
export class BadgeModalComponent implements OnInit, OnChanges {
  @Input() showModal: boolean;
  @Input() badge: Badge;
  @Input() reading: Reading;

  @Output() dismiss = new EventEmitter<boolean>();

  ruleList: {label: string, success: boolean}[] = []


  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    this.ruleList = this.badge.rule.and.map(rule => {
      return {
        label: Object.values(rule)[0][0].var, // todo : trad statement to english/french
        success: jsonLogic.apply(rule, this.reading.statements)
      }
    })
  }

  hide() {
    this.dismiss.emit(true);
  }

}
