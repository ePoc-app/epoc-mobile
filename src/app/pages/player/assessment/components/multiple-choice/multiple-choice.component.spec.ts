import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MultipleChoiceComponent} from '../multiple-choice/multiple-choice.component';

describe('MultipleChoiceComponent', () => {
    let component: MultipleChoiceComponent;
    let fixture: ComponentFixture<MultipleChoiceComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MultipleChoiceComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MultipleChoiceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
