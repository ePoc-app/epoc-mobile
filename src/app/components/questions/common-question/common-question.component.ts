import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Question} from 'src/app/classes/contents/assessment';
import {Reading} from 'src/app/classes/reading';
import {ReadingStoreService} from 'src/app/services/reading-store.service';
import {FlipCardComponent} from 'src/app/components/flip-card/flip-card.component';

@Component({
  selector: 'common-question',
  templateUrl: './common-question.component.html',
  styleUrls: ['./common-question.component.scss'],
})
export class CommonQuestionComponent implements OnInit {
  @Input() question: Question;
  @Input() contentId: string;
  @Input() epocId: string;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() icon: string;

  @Output() questionAnswered = new EventEmitter<boolean>();

  @ViewChild(FlipCardComponent, { static: false })
  private flipCardComponent!: FlipCardComponent;

  reading: Reading;
  flipped = false;
  questionDisabled = false;
  explanationShown = false;
  userResponses;

  constructor(
      private readingStore: ReadingStoreService
  ) { }

  ngOnInit() {
    this.readingStore.readings$.subscribe(readings => {
      if (readings) {
        this.reading = readings.find(item => item.epocId === this.epocId);

        const assessment = this.reading.assessments.find(a => a.id === this.contentId);

        if (assessment) {
          this.questionDisabled = true;
          this.userResponses = assessment.responses;
          this.flipped = true;
          this.questionAnswered.emit(true);
        }
      }
    });
  }

  calcScore() {
    this.questionDisabled = true;
    let score = 0;
    if (this.userResponses.length === this.question.correctResponse.length) {
      score = this.userResponses.every((response) => this.question.correctResponse.includes(response)) ? +this.question.score : 0;
    }
    this.questionAnswered.emit(true);
    this.flip();
    // this.readingStore.saveResponses(this.epocId, this.contentId, score, this.userResponses);
  }

  flip() {
    if (this.questionDisabled) {
      this.flipCardComponent.flip();
      this.flipped = this.flipCardComponent.flipped;
    }
  }

  toggleExplanation() {
    this.explanationShown = !this.explanationShown;
  }

  updateUserResponse(userResponse) {
    this.userResponses = userResponse;
  }
}
