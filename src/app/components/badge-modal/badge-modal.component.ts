import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Badge, Epoc} from 'src/app/classes/epoc';
import {Reading} from 'src/app/classes/reading';
import * as jsonLogic from 'json-logic-js/logic';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'badge-modal',
  templateUrl: './badge-modal.component.html',
  styleUrls: ['./badge-modal.component.scss'],
})
export class BadgeModalComponent implements OnInit, OnChanges {
  @Input() showModal: boolean;
  @Input() badge: Badge;
  @Input() epoc: Epoc;
  @Input() reading: Reading;

  @Output() dismiss = new EventEmitter<boolean>();

  ruleList: {label: string, success: boolean}[] = [];


  constructor(public translate: TranslateService) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    this.ruleList = this.badge.rule.and.map(rule => {
      const statement = Object.values(rule)[0][0].var;
      const value = Object.values(rule)[0][1];
      const split = statement.split('.');
      const type = split[0];
      const id = split[1];
      const verb = this.translate.instant(`BADGE.PASSIVE_VERBS.${split[2]}`, {[split[2]]: value});
      const entity = this.epoc[type !== 'pages' ? type : 'contents'][id]; // To remove in V2
      const entityType = this.translate.instant(`BADGE.ENTITY_TYPES.${type !== 'pages' ? entity.type : 'page'}`); // To remove in V2
      const title = entity.title ? entity.title : entity.type;
      const statements = this.reading?.statements ? this.reading.statements : {};
      return {
        label: `${verb} ${entityType} "${title}"`,
        success: jsonLogic.apply(rule, statements)
      }
    })
  }

  hide() {
    this.dismiss.emit(true);
  }

}
