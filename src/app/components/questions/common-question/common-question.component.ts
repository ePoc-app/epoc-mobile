import {Component, Input, OnInit, ViewChild} from '@angular/core';
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

  @ViewChild(FlipCardComponent, { static: false })
  private flipCardComponent!: FlipCardComponent;

  reading: Reading;
  flipDisabled = true;
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
          this.flip();
        }
      }
    });
  }

  checkAnswer() {
    this.flipDisabled = false;
    this.flip();
  }

  flip() {
    this.flipped = !this.flipped;
    this.flipCardComponent.flip();
  }

  toggleExplanation() {
    this.explanationShown = !this.explanationShown;
  }

  updateUserResponse(userResponse) {

  }
}
