import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
})
export class BadgeComponent implements OnInit {

  @Input() title?: string;
  @Input() icon: string;
  @Input() grey: boolean;
  @Input() locked: boolean;
  @Input() nobg?: boolean;

  prefix = '/assets/icon/badge/';
  shape = '';
  shadow = '';

  constructor() {}

  ngOnInit(): void {
    this.shape = this.prefix + (this.grey ? 'shape-grey' : 'shape') + '.svg';
    this.shadow = this.prefix + (this.grey ? 'shadow-grey' : 'shadow') + '.svg';

    if (!this.icon.endsWith('.svg')) {
      this.icon = this.prefix + this.icon + '.svg';
    }
  }
}
