import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Question} from 'src/app/classes/contents/assessment';

@Component({ template: '' })
export class AbstractQuestionComponent implements OnInit{
    @Input() question: Question;
    @Input() disabled: boolean;
    @Input() userPreviousResponse: string[];

    @Output() userResponse = new EventEmitter<any>();

    constructor() {}

    ngOnInit() {}
}
