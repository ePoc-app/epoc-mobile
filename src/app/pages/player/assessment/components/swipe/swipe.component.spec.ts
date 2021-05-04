import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SwipeComponent } from './swipe.component';
import {Response, SwipeQuestion} from '../../../../../classes/contents/assessment';

describe('SwipeComponent', () => {
  let component: SwipeComponent;
  let fixture: ComponentFixture<SwipeComponent>;
  const c1 = new Response();
  const c2 = new Response();
  const c3 = new Response();


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwipeComponent ],
      imports: [],

    }).compileComponents();

    fixture = TestBed.createComponent(SwipeComponent);
    component = fixture.componentInstance;
    component.question = new SwipeQuestion();
    c1.value = '1';
    c1.label = 'Texte à afficher';
    c2.value = '2';
    c2.label = 'Deuxième texte';
    c3.value = '3';
    c3.label = 'Troisième texte';
    component.question.possibilities = ['Faux','Vrai'];
    component.question.responses = [c1, c2, c3];
    component.cartesRestantes = [c2, c3];
    component.cartesTriees = [c1];
    component.cardsToTheLeft = [];
    component.cardsToTheLeft = [];
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Cas de tests pour la méthode undo()
  it('should undo', () => {
    component.undo();
    expect(component.cartesTriees).toEqual([]);
    expect(component.cartesRestantes).toEqual(component.question.responses);
  });
  it('should not undo', () => {
    component.cartesRestantes = [c1, c2, c3];
    component.cartesTriees = [];
    expect( () => { component.undo(); }).toThrow(new Error('Array of cards swiped is empty'));
  });

  // Cas de tests pour la méthode onSelectSide(answer)
  // Cas classique
  it ('should push the value of the response to cardsToTheLeft', () => {
    component.onSelectSide({rep:c1, category:'Faux'});
    expect(component.cardsToTheLeft).toEqual(['1']);
  });

  it ('should emit onEndActivity event', () => {
    component.onSelectSide({rep:c1, category:'Faux'});
    component.onSelectSide({rep:c2, category:'Faux'});
    // Vérifier que l'évènement est bien émis
    spyOn(component.onEndActivity, 'emit');

    // trigger l'évènement en appelant la méthode
    component.onSelectSide({rep:c3, category:'Vrai'});
    expect(component.onEndActivity.emit).toHaveBeenCalledWith([{label: 'Faux', list: ['1','2']}, {label: 'Vrai', list: ['3']}]);
  });
  // Cas d'erreur : answer n'est pas une réponse valable
  it ('should raise an error', () => {
    expect(() => { component.onSelectSide('Impossible');}).toThrow(new Error('Answer is not a possibility'));
  });

});


