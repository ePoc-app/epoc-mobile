import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SwipeCardComponent } from './swipe-card.component';

describe('SwipeCardComponent', () => {
  let component: SwipeCardComponent;
  let fixture: ComponentFixture<SwipeCardComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwipeCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SwipeCardComponent);
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
  it ('should emit a onSelectAnswer event to the parent when (onEnd)', () => {
    let selectedAnswer;
    component.onSelectAnswer.subscribe((answer: string) => selectedAnswer = answer);
    fixture.debugElement.triggerEventHandler('onEnd', null);
    expect(expectedAnswer).toBe(selectedAnswer);
  })
});
