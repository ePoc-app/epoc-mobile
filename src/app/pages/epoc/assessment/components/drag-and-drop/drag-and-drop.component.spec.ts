import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {DragAndDropquestion, Response} from 'src/app/classes/contents/assessment'
import {DragAndDropComponent} from './drag-and-drop.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('DragAndDropComponent', () => {
    let component: DragAndDropComponent;
    let fixture: ComponentFixture<DragAndDropComponent>;
    const r1 = new Response();
    const r2 = new Response();
    const r3 = new Response();
    const r4 = new Response();
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DragAndDropComponent ],
            imports: [BrowserAnimationsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(DragAndDropComponent);
        component = fixture.componentInstance;
        r1.value = 'A';
        r1.label = 'IA est une discipline scientifique. ';
        r2.value = 'B';
        r2.label = 'Les programmes basés sur l\'IA sont le fruit d\'un savoir par apprentissage. ';
        r3.value = 'C';
        r3.label = 'Tous les robots sont dotés d’intelligence artificielle. ';
        r4.value = 'D';
        r4.label = ' Certaines IA se procurent elles-mêmes les données et n\'auront pas besoin de l\'homme. ';
        component.question = new DragAndDropquestion();
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

    // addResponse(index)
    it('should emit event onSelectAnswer', () => {
        component.responses = [r1, r2, r3, r4];
        // On ajoute A dans catégorie 0
        component.addResponse(0);
        // On ajoute B dans catégorie 0
        component.addResponse(0);
        // On ajoute C dans catégorie 2
        component.addResponse(2);

        // Vérifier que l'évènement est bien émis
        spyOn(component.onSelectAnswer, 'emit');

        // On ajoute D dans catégorie 1 (derniere réponse à ajouter)
        component.addResponse(1);
        expect(component.onSelectAnswer.emit).toHaveBeenCalledWith([['A', 'B'], ['D'], ['C']]);
    })

    // updateDisplay
    it('should update values depending on correctionState & solutionShown', () => {
        component.correctionState = false;
        component.solutionShown = false;
        component.updateDisplay(component.correctionState, component.solutionShown);
        expect(component.selectHeader).toEqual('');
        expect(component.selectValue).toEqual([]);
        component.responses = [r1, r2, r3, r4];
        // On ajoute A dans catégorie 0
        component.addResponse(0);
        // On ajoute B dans catégorie 0
        component.addResponse(0);
        // On ajoute C dans catégorie 2
        component.addResponse(2);
        // On ajoute D dans catégorie 1 (derniere réponse à ajouter)
        component.addResponse(1);
        component.correctionState = true;
        component.updateDisplay(component.correctionState, component.solutionShown);
        expect(component.selectHeader).toEqual(1 + ' / ' + 4 + ' réponses justes');
        expect(component.selectValue).toEqual([]);
        component.solutionShown = true;
        component.updateDisplay(component.correctionState, component.solutionShown);
        expect(component.selectHeader).toEqual('Solution');
        expect(component.selectValue[r1.value]).toEqual(r1.label);
        expect(component.selectValue[r2.value]).toEqual(r2.label);
        expect(component.selectValue[r3.value]).toEqual(r3.label);
        expect(component.selectValue[r4.value]).toEqual(r4.label);

    })
});
