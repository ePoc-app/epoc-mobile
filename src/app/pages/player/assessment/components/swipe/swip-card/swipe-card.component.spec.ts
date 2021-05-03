import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SwipeCardComponent } from './swipe-card.component';
import {SwipeCard} from '../../../../../../classes/contents/assessment';
import {SwipeComponent} from '../swipe.component';
import {fromEvent, Observable} from "rxjs";




describe('SwipeCardComponent', () => {
  let component: SwipeCardComponent;
  let fixture: ComponentFixture<SwipeCardComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: []
    }).compileComponents();
    fixture = TestBed.createComponent(SwipeCardComponent);
    component = fixture.componentInstance;
    const debugElement = fixture.debugElement;
    component.responses = ['Vrai','Faux'];
    component.swipeCard = new SwipeCard();
    component.swipeCard.id = 1;
    component.swipeCard.text = 'Texte à afficher';
    component.disabled = false;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Cas de tests pour la méthode selectAnswer
  // Tester que selectedAnswer se met à jour
  it ('should update selectedAnswer', () => {
    component.selectAnswer('Vrai');
    expect(component.selectedAnswer).toBe('Vrai');
  });

    // Tester que selectedAnswer ne se met pas à jour si la réponse n'est pas dans responses
    it ('should not update selectedAnswer', () => {
      expect(function() { component.selectAnswer('Impossible'); }).toThrow(new Error('Answer is not a possibility'));
      });
/*
    // Tester qu'un évènement onSelectAnswer est déclenché
    const expectedAnswer = 'Vrai';
    it ('should emit a onSelectAnswer event to the parent', () => {
      let selectedAnswer;
      const observator: Observable<any> = fromEvent(document, 'onSelectAnswer');
      observator.subscribe(() => selectedAnswer = 'Vrai');
      fixture.debugElement.triggerEventHandler('onSelectAnswer', null);
      expect(expectedAnswer).toBe(selectedAnswer);
    })
*/
  // Cas de tests pour la méthode displayTitle
  it ('should update the HTML element with \'\'', () => {
    const deltaX = 0;
    const elt = document.getElementsByTagName('ion-card-title')[0];
    component.displayTitle(deltaX);
    expect(elt.innerHTML).toEqual('');
  })

  it ('should update the HTML element with \'Vrai\'', () => {
    const deltaX = 1;
    component.displayTitle(deltaX);
    const elt = document.getElementsByTagName('ion-card-title')[0];
    expect(elt.innerHTML).toEqual(component.responses[0]);
  })

  it ('should update the HTML element with \'Faux\'', () => {
    const deltaX = -1;
    component.displayTitle(deltaX);
    const elt = document.getElementsByTagName('ion-card-title')[0];
    expect(elt.innerHTML).toEqual(component.responses[1]);
  })


});
