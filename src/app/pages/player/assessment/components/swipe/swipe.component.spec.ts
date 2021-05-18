import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SwipeComponent } from './swipe.component';
import {Response, SwipeQuestion} from '../../../../../classes/contents/assessment';
import {ModalController} from '@ionic/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('SwipeComponent', () => {
  let component: SwipeComponent;
  let fixture: ComponentFixture<SwipeComponent>;
  const c1 = new Response();
  const c2 = new Response();
  const c3 = new Response();

    const modalSpy = jasmine.createSpyObj('Modal', ['present']);
    const modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);
    modalCtrlSpy.create.and.callFake( () => {
        return modalSpy;
    });
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwipeComponent ],
        providers: [{
            provide: ModalController,
            useValue: modalCtrlSpy
        }],
      imports: [BrowserAnimationsModule]

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
    component.question.correctResponse = [{label: 'Faux', values:['1', '2']}, {label:'Vrai', values:['3']}];
    component.cartesRestantes = [c1, c2];
    component.cartesTriees = [{response: c3, category:0, correct: true}];
    component.cardsToTheLeft = [];
    component.cardsToTheLeft = [];
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Cas de tests pour la méthode undo()
  it('should undo', () => {
    component.cartesRestantes = [c1, c2];
    component.cartesTriees = [{response: c3, category:0, correct: true}];
    component.undo();
    expect(component.cartesTriees).toEqual([]);
    expect(component.cartesRestantes).toEqual([c1, c2, c3]);
  });
  it('should not undo', () => {
    component.cartesRestantes = [c1, c2, c3];
    component.cartesTriees = [];
    expect( () => { component.undo(); }).toThrow(new Error('Array of cards swiped is empty'));
  });

  // Cas de tests pour la méthode onSelectSide(answer)
  // Cas classique
  it ('should push the value of the response to cardsToTheLeft', () => {
    component.onSelectSide({rep:c1, category:0});
    expect(component.cardsToTheLeft).toEqual(['1']);
  });

  it ('should emit onSelectAnswer event', () => {
    component.onSelectSide({rep:c1, category:0});
    component.onSelectSide({rep:c2, category:0});
    // Vérifier que l'évènement est bien émis
    spyOn(component.onSelectAnswer, 'emit');

    // trigger l'évènement en appelant la méthode
    component.onSelectSide({rep:c3, category:1});
    expect(component.onSelectAnswer.emit).toHaveBeenCalledWith([['1','2'], ['3']]);
  });
  // Cas d'erreur : answer n'est pas une réponse valable
  it ('should raise an error', () => {
    expect(() => { component.onSelectSide(3);}).toThrow(new Error('Answer is not a possibility'));
  });
  // Cas : met à jour les deux tableaux cartesTriees, Cartesrestantes
  it ('should update all arrays', () => {
    component.cartesRestantes = [c1,c2,c3];
    component.cartesTriees = [];
    component.cardsToTheLeft = [];
    component.cardsToTheRight = [];

    // Swipe de la première carte qui s'affiche (donc la dernière de l'array) vers la gauche 'catégory : faux'
    component.onSelectSide({rep:c3, category:0});
    expect(component.cartesRestantes).toEqual([c1,c2]);
    expect(component.cartesTriees).toEqual([{response: c3, category: 0, correct: false}]);
    expect(component.cardsToTheLeft).toEqual([c3.value]);
    expect(component.cardsToTheRight).toEqual([]);

    // Swipe de la deuxième carte qui s'affiche (donc la dernière -1 de l'array) vers la droite 'catégory : vrai'
    component.onSelectSide({rep: c2, category:1});
    expect(component.cartesRestantes).toEqual([c1]);
    expect(component.cartesTriees).toEqual([{response: c3, category: 0, correct: false}, {response: c2, category: 1, correct:false}]);
    expect(component.cardsToTheLeft).toEqual([c3.value]);
    expect(component.cardsToTheRight).toEqual([c2.value]);

   // Swipe de la troisième carte qui s'affiche (donc la dernière -2 de l'array) vers la gauche 'catégory : faux'
   component.onSelectSide({rep: c1, category:0});
   expect(component.cartesRestantes).toEqual([]);
   expect(component.cartesTriees).toEqual([
       {response: c3, category: 0, correct: false},
       {response: c2, category: 1, correct:false},
       {response: c1, category: 0, correct: true}
   ]);
   expect(component.cardsToTheLeft).toEqual([c3.value, c1.value]);
   expect(component.cardsToTheRight).toEqual([c2.value]);

   // Appel de la méthode undo
   component.undo();
   expect(component.cartesRestantes).toEqual([c1]);
      expect(component.cartesTriees).toEqual([{response: c3, category: 0, correct: false}, {response: c2, category: 1, correct:false}]);
   expect(component.cardsToTheLeft).toEqual([c3.value]);
   expect(component.cardsToTheRight).toEqual([c2.value]);

   // Appel de la méthode undo
   component.undo();
   expect(component.cartesRestantes).toEqual([c1,c2]);
      expect(component.cartesTriees).toEqual([{response: c3, category: 0, correct: false}]);
   expect(component.cardsToTheLeft).toEqual([c3.value]);
   expect(component.cardsToTheRight).toEqual([]);

   // Appel de la méthode undo
   component.undo();
   expect(component.cartesRestantes).toEqual([c1,c2,c3]);
   expect(component.cartesTriees).toEqual([]);
   expect(component.cardsToTheLeft).toEqual([]);
   expect(component.cardsToTheRight).toEqual([]);

  })

});


