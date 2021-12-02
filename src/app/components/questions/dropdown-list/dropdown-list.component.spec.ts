import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {DropDownListQuestion, Response} from 'src/app/classes/contents/assessment'
import { DropdownListComponent } from './dropdown-list.component';

describe('DropdownListComponent', () => {
  let component: DropdownListComponent;
  let fixture: ComponentFixture<DropdownListComponent>;
  const r1 = new Response();
  const r2 = new Response();
  const r3 = new Response();
  const r4 = new Response();
  const c1 = 'Imaginaire collectif';
  const c2 = 'Fait scientifique';
  const c3 = 'Troisième catégorie';
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownListComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownListComponent);
    component = fixture.componentInstance;
    r1.value = 'A';
    r1.label = 'IA est une discipline scientifique. ';
    r2.value = 'B';
    r2.label = 'Les programmes basés sur l\'IA sont le fruit d\'un savoir par apprentissage. ';
    r3.value = 'C';
    r3.label = 'Tous les robots sont dotés d’intelligence artificielle. ';
    r4.value = 'D';
    r4.label = ' Certaines IA se procurent elles-mêmes les données et n\'auront pas besoin de l\'homme. ';
    component.answers = new Array<Array<string>>();
    component.question = new DropDownListQuestion();
    component.question.responses = [r1, r2, r3, r4];
    component.question.categories = [c1, c2, c3];
    component.question.correctResponse =
        [
          {label: 'Imaginaire collectif', values:['B', 'D']},
          {label:'Fait scientifique', values:['A', 'C']},
          {label: 'Troisième catégorie', values: []}
        ];
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('should emit onSelectAnswer event', () => {
    component.onSelectProp({category: c1, label: r1.label});
    component.onSelectProp({category: c2, label: r2.label});
    component.onSelectProp({category: c1, label: r3.label});
    // Vérifier que l'évènement est bien émis
    spyOn(component.onSelectAnswer, 'emit');
    // trigger l'évènement en appelant la méthode
    component.onSelectProp({category: c2, label: r4.label});
    expect(component.onSelectAnswer.emit).toHaveBeenCalledWith([[r1.value, r3.value], [r2.value, r4.value], []]);
  });


  it ('should update the array answers[string[]]', () => {
    component.onSelectProp({category: c1, label: r1.label});
    expect(component.answers).toEqual([[r1.value], [], []]);
    component.onSelectProp({category: c2, label: r2.label});
    expect(component.answers).toEqual([[r1.value], [r2.value], []]);
    component.onSelectProp({category: c1, label: r3.label});
    expect(component.answers).toEqual([[r1.value, r3.value], [r2.value], []]);
    component.onSelectProp({category: c2, label: r4.label});
    expect(component.answers).toEqual([[r1.value, r3.value], [r2.value, r4.value], []]);
  });
});
