import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ReadingStoreService} from 'src/app/services/reading-store.service';
import {Reading} from 'src/app/classes/reading';
import {Content} from 'src/app/classes/contents/content';
import {ChoiceCondition} from '@epoc/epoc-types/dist/v1';

@Component({
    selector: 'course-choice',
    templateUrl: './course-choice.component.html',
    styleUrls: ['./course-choice.component.scss'],
})
export class CourseChoiceComponent implements OnInit {

    @Input() content: Content;
    @Input() epocId: string;
    @Output() chosen = new EventEmitter();

    resolver;
    answer;
    reading: Reading;

    constructor(
        private readingStore: ReadingStoreService
    ) {}

    ngOnInit(): void {
        this.resolver = (this.content as ChoiceCondition).conditionResolver;

        this.readingStore.readings$.subscribe(readings => {
            if (readings) {
                this.reading = readings.find(item => item.epocId === this.epocId);

                const choices = this.reading.choices.find(c => c.id === this.content.id);

                if (choices) {
                    this.answer = choices.responses;
                }
            }
        });
    }

    selectAnswer(answer) {
        this.answer = answer;
        const flags = (this.content as ChoiceCondition).conditionResolver.conditionalFlag.find(
            condition => condition.value === this.answer
        ).flags;
        const flagsToRemove = (this.content as ChoiceCondition).conditionResolver.conditionalFlag.reduce(
            (acc, condition) => acc.concat(condition.flags), []
        );
        this.readingStore.saveChoices(this.epocId, this.content.id, this.answer, flags, flagsToRemove);
        setTimeout(() => {this.chosen.emit()}, 200)
    }
}
