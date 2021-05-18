import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {DropdownListQuestion, Response} from '../../../../../classes/contents/assessment'
import { DropdownListComponent } from './dropdown-list.component';

describe('DropdownListComponent', () => {
  let component: DropdownListComponent;
  let fixture: ComponentFixture<DropdownListComponent>;
  const r1 = new Response();
  const r2 = new Response();
  const r3 = new Response();
  const p1 = 'IA est une discipline scientifique. ';
  const p2 = 'Les programmes basés sur l\'IA sont le fruit d\'un savoir par apprentissage. ';
  const p3 = 'Tous les robots sont dotés d’intelligence artificielle. ';
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownListComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownListComponent);
    component = fixture.componentInstance;
    r1.value = '315431';
    r1.label = 'Fait scientifique';
    r2.value = '221455';
    r2.label = 'Imaginaire collectif';
    r3.value = '367854';
    r3.label = 'Troisième catégorie';
    component.answers = new Array<Array<string>>();
    component.question = new DropdownListQuestion();
    component.question.responses = [r1, r2, r3];
    component.question.propositions = [p1, p2, p3];
    component.question.correctResponse =
        [
          {label: 'Fait scientifique', values:[p1, p2]},
          {label:'Imaginaire collectif', values:[p3]},
          {label: 'Troisième catégorie', values: []}
        ];
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('should emit onSelectAnswer event', () => {
    component.onSelectProp({prop: p1, response: r1});
    component.onSelectProp({prop: p2, response: r1});
    // Vérifier que l'évènement est bien émis
    spyOn(component.onSelectAnswer, 'emit');
    // trigger l'évènement en appelant la méthode
    component.onSelectProp({prop: p3, response: r2});
    expect(component.onSelectAnswer.emit).toHaveBeenCalledWith([[r1.value], [r1.value], [r2.value]]);
  });


  it ('should update the array answers[string[]]', () => {
    component.onSelectProp({prop: p1, response: r1});
    expect(component.answers).toEqual([[r1.value], [], []]);
    component.onSelectProp({prop: p2, response: r1});
    expect(component.answers).toEqual([[r1.value], [r1.value], []]);
    component.onSelectProp({prop: p3, response: r2});
    expect(component.answers).toEqual([[r1.value], [r1.value], [r2.value]]);
  });
});
