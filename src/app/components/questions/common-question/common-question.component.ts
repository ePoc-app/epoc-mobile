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
  @Input() closable: boolean;
  @Input() question: Question;
  @Input() contentId: string;
  @Input() epocId: string;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() icon: string;
  @Input() userAssessment;

  @Output() userHasResponded = new EventEmitter<any>();
  @Output() questionAnswered = new EventEmitter<boolean>();
  @Output() dragging = new EventEmitter<string>();
  @Output() close = new EventEmitter<boolean>();

  @ViewChild(FlipCardComponent, { static: false })
  private flipCardComponent!: FlipCardComponent;

  reading: Reading;
  flipped = false;
  questionDisabled = false;
  explanationShown = false;
  userResponses;

  constructor() { }

  ngOnInit() {
    if (this.userAssessment) {
      this.questionDisabled = true;
      this.userResponses = this.userAssessment.responses;
      this.flipped = true;
      this.questionAnswered.emit(true);
    }
  }

  showCorrection() {
    this.questionDisabled = true;
    this.questionAnswered.emit(true);
    this.flip();
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
    this.userHasResponded.emit(this.userResponses);
  }

  onDrag(value){
    this.dragging.emit(value);
  }

  back(event) {
    event.preventDefault();
    event.stopPropagation();
    this.close.emit(true)
  }
}
