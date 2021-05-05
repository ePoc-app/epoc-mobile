import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SwipeCardComponent } from './swipe-card.component';
import {Response} from '../../../../../../classes/contents/assessment';

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
    component.possibilities = ['Vrai','Faux'];
    const rep = new Response();
    rep.label = 'Texte à afficher';
    rep.value = '1';
    component.response = rep;
    component.disabled = false;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Cas de tests pour la méthode selectSide
  // Tester que selectedAnswer se met à jour
  it ('should update selectedAnswer', () => {
    component.selectSide('Vrai');
    expect(component.selectedSide).toBe('Vrai');
  });

    // Tester que selectedAnswer ne se met pas à jour si la réponse n'est pas dans responses
    it ('should not update selectedAnswer', () => {
      expect(() => { component.selectSide('Impossible'); }).toThrow(new Error('Answer is not a possibility'));
      });

    // Tester qu'un évènement onSelectSide est déclenché
    it ('should emit a onSelectSide event', () => {
      spyOn(component.onSelectSide, 'emit');

      // trigger l'évènement en appelant la méthode
      component.selectSide('Faux');
      expect(component.onSelectSide.emit).toHaveBeenCalledWith({rep: component.response, category:'Faux'});
    })

  // Cas de tests pour la méthode displayTitle
  it ('should update the HTML element with \'\'', () => {
    const deltaX = 0;
    const elt = document.getElementsByTagName('ion-card-title')[0];
    component.displayTitle(deltaX, debugElement.nativeElement);
    expect(elt.innerHTML).toEqual('');
  })

  it ('should update the HTML element with \'Vrai\'', () => {
    const deltaX = 1;
    component.displayTitle(deltaX, debugElement.nativeElement);
    const elt = document.getElementsByTagName('ion-card-title')[0];
    expect(elt.innerHTML).toEqual(component.possibilities[1]);
  })

  it ('should update the HTML element with \'Faux\'', () => {
    const deltaX = -1;
    component.displayTitle(deltaX, debugElement.nativeElement);
    const elt = document.getElementsByTagName('ion-card-title')[0];
    expect(elt.innerHTML).toEqual(component.possibilities[0]);
  })


});
