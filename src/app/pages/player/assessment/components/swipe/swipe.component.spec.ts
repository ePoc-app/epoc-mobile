import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipeComponent } from './swipe.component';
import {SwipeCard, SwipeQuestion} from '../../../../../classes/contents/assessment';

describe('SwipeComponent', () => {
  let component: SwipeComponent;
  let fixture: ComponentFixture<SwipeComponent>;
  const c1 = new SwipeCard();
  const c2 = new SwipeCard();
  const c3 = new SwipeCard();


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwipeComponent ],
      imports: [],

    }).compileComponents();

    fixture = TestBed.createComponent(SwipeComponent);
    component = fixture.componentInstance;
    component.question = new SwipeQuestion();
    c1.id = 1;
    c1.text = 'Texte à afficher';
    c2.id = 2;
    c2.text = 'Deuxième texte';
    c3.id = 3;
    c3.text = 'Troisième texte';
    component.question.possibilities = ['Vrai','Faux'];
    component.responses = ['Vrai'];
    component.question.swipeCards = [c1, c2, c3];
    component.cartesRestantes = [c2, c3];
    component.cartesTriees = [c1];
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Cas de tests pour la méthode undo()
  it('should undo', () => {
    component.undo();
    expect(component.cartesTriees).toEqual([]);
    expect(component.cartesRestantes).toEqual(component.question.swipeCards);
  });
  it('should not undo', () => {
    component.cartesRestantes = [c1, c2, c3];
    component.cartesTriees = [];
    expect(function () { component.undo(); }).toThrow(new Error('Array of cards left is empty'));
  });

  // Cas de tests pour la méthode onSelectAnswer(answer)
  // Cas classique
  it ('should push the answer to responses', () => {
    component.cartesRestantes = [c1, c2, c3];
    component.onSelectAnswer('Faux');
    expect(component.responses).toEqual(['Vrai','Faux']);
  });
  it ('should emit onEndActivity event', () => {
    component.cartesRestantes = [];
    // Vérifier que l'évènement est bien émis
    spyOn(component.onEndActivity, 'emit');
    // trigger l'évènement en appelant la méthode
    component.onSelectAnswer('Faux');
    expect(component.onEndActivity.emit).toHaveBeenCalledWith(component.responses);
  });
  // Cas d'erreur : answer n'est pas une réponse valable
  it ('should raise an error', () => {
    expect(function() { component.onSelectAnswer('Impossible');}).toThrow(new Error('Answer is not a possibility'));
  });

});


