import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Question} from 'src/app/classes/contents/assessment';
import {Reading} from 'src/app/classes/reading';
import {ReadingStoreService} from 'src/app/services/reading-store.service';
import {FlipCardComponent} from 'src/app/components/flip-card/flip-card.component';
import {AppService} from 'src/app/services/app.service';

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

  @Input() showExplainButton: boolean;

  private _userAssessment;
  @Input() set userAssessment(value) {

    this._userAssessment = value;
    this.setState();
  }

  get userAssessment() {
    return this._userAssessment;
  }

  @Output() userHasResponded = new EventEmitter<any>();
  @Output() questionAnswered = new EventEmitter<boolean>();
  @Output() dragging = new EventEmitter<string>();
  @Output() close = new EventEmitter<boolean>();
  @Output() explanationToggle = new EventEmitter<boolean>();

  @ViewChild(FlipCardComponent, { static: false })
  private flipCardComponent!: FlipCardComponent;

  reading: Reading;
  flipped = false;
  questionDisabled = false;
  explanationShown = false;
  userResponses;

  constructor(
    public appService: AppService,
  ) { }

  ngOnInit() {
    this.setState();
  }

  setState() {
    if (this.userAssessment) {
      this.questionDisabled = true;
      this.userResponses = this.userAssessment.responses;
      this.flipped = true;
      this.questionAnswered.emit(true);
    } else {
      this.questionDisabled = false;
      this.userResponses = null;
      this.flipped = false;
      this.questionAnswered.emit(false);
      if (this.flipCardComponent) this.flipCardComponent.showFront();
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
      this.updateFocus();
    }
    setTimeout(() => {
      this.updateFocus();
    }, 600);
  }

  toggleExplanation(event?) {
    if (event) event.stopPropagation();
    this.explanationShown = !this.explanationShown;
    this.explanationToggle.emit(this.explanationShown);
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

  updateFocus() {
    if(this.appService.screenReaderDetected) {
      (document.querySelector('app-epoc-assessment .assessment-reader') as HTMLElement).focus();
    }
  }
}
