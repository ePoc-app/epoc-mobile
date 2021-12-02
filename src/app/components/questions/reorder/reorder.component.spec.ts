import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {Question, Response} from 'src/app/classes/contents/assessment'
import {ReorderComponent} from './reorder.component';

describe('ReorderComponent', () => {
    let component: ReorderComponent;
    let fixture: ComponentFixture<ReorderComponent>;
    const r1 = new Response();
    const r2 = new Response();
    const r3 = new Response();
    const r4 = new Response();
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ReorderComponent ]
        }).compileComponents();

        fixture = TestBed.createComponent(ReorderComponent);
        component = fixture.componentInstance;
        r1.value = 'A';
        r1.label = 'IA est une discipline scientifique. ';
        r2.value = 'B';
        r2.label = 'Les programmes basés sur l\'IA sont le fruit d\'un savoir par apprentissage. ';
        r3.value = 'C';
        r3.label = 'Tous les robots sont dotés d’intelligence artificielle. ';
        r4.value = 'D';
        r4.label = ' Certaines IA se procurent elles-mêmes les données et n\'auront pas besoin de l\'homme. ';
        component.question = new Question();
        component.question.responses = [r1, r2, r3, r4];
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

    it('should update values depending on correctionState & solutionShown ', () => {
        component.correctionState = false;
        component.solutionShown = false;
        component.updateDisplay(component.correctionState, component.solutionShown);
        expect(component.selectHeader).toEqual('');
        component.correctionState = true;
        // TO DO
/*        const ev = {};
        component.doReorder(ev);
        component.updateDisplay(component.correctionState, component.solutionShown);
        expect(component.selectHeader).toEqual(1 + ' / ' + 4 + ' réponses justes');
        component.solutionShown = true;
        component.updateDisplay(component.correctionState, component.solutionShown);
        expect(component.selectHeader).toEqual('Solution');*/
    });

    it('should give a different array', () => {

    })
});
