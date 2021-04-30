import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SwipCardComponent } from './swip-card.component';

describe('SwipCardComponent', () => {
  let component: SwipCardComponent;
  let fixture: ComponentFixture<SwipCardComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwipCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SwipCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // Cas de tests pour la méthode selectAnswer
  component.responses = ['Vrai', 'Faux'];
  // Tester que selectedAnswer se met à jour
  component.selectAnswer('Vrai');
  it ('should update selectedAnswer', () => {
    expect(this.selectedAnswer).toBe('Vrai');
  });
  // Tester que selectedAnswer ne se met pas à jour si la réponse n'est pas dans responses
  component.selectAnswer('Impossible')
  it ('should not update selectedAnswer', () => {
    expect(Error);
  })
  // Tester qu'un évènement onSelectAnswer est déclenché
  const expectedAnswer = 'Vrai';
  it ('should emit a onSelectAnswer event to the parent when (swipe)', () => {
    let selectedAnswer;
    component.onSelectAnswer.subscribe((answer: string) => selectedAnswer = answer);
    fixture.debugElement.triggerEventHandler('swipe', null);
    expect(expectedAnswer).toBe(selectedAnswer);
  })
});
