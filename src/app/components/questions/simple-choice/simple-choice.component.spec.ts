import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
    Response,
    SimpleChoiceQuestion
} from 'src/app/classes/contents/assessment'
import {SimpleChoiceComponent} from './simple-choice.component';

describe('SimpleChoiceComponent', () => {
    let component: SimpleChoiceComponent;
    let fixture: ComponentFixture<SimpleChoiceComponent>;
    const r1 = new Response();
    const r2 = new Response();
    const r3 = new Response();
    const r4 = new Response();
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ SimpleChoiceComponent ]
        }).compileComponents();

        fixture = TestBed.createComponent(SimpleChoiceComponent);
        component = fixture.componentInstance;
        r1.value = 'A';
        r1.label = 'IA est une discipline scientifique. ';
        r2.value = 'B';
        r2.label = 'Les programmes basés sur l\'IA sont le fruit d\'un savoir par apprentissage. ';
        r3.value = 'C';
        r3.label = 'Tous les robots sont dotés d’intelligence artificielle. ';
        r4.value = 'D';
        r4.label = ' Certaines IA se procurent elles-mêmes les données et n\'auront pas besoin de l\'homme. ';
        component.question = new SimpleChoiceQuestion();
        component.question.responses = [r1, r2, r3, r4];
        component.question.correctResponse = r1.label;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit userResponse event', () => {
        spyOn(component.userResponse, 'emit');
        component.selectAnswer(r1);
        expect(component.userResponse.emit).toHaveBeenCalledWith(r1);
    });

});
