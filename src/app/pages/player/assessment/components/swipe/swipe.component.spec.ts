import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipeComponent } from './swipe.component';
import {SwipeCard, SwipeQuestion} from '../../../../../classes/contents/assessment';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe('SwipeComponent', () => {
  let component: SwipeComponent;
  let fixture: ComponentFixture<SwipeComponent>;
  let c1 = new SwipeCard();
  let c2 = new SwipeCard();
  let c3 = new SwipeCard();


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
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Cas de tests pour la méthode undo()
  it('should undo', () => {
    component.question.swipeCards = [c1, c2, c3];
    component.cartesRestantes = [c2, c3];
    component.cartesTriees = [c1];
    component.undo();
    expect(component.cartesTriees).toEqual([]);
    expect(component.cartesRestantes).toEqual(component.question.swipeCards);
  })
  it('should not undo', () => {
    component.cartesRestantes = [c1, c2, c3];
    component.cartesTriees = [];
    expect(function () { component.undo(); }).toThrow(new Error('Array of cards left is empty'));
  })
});
