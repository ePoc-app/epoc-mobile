import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SimpleChoiceComponent} from './simple-choice.component';

describe('SimpleChoiceComponent', () => {
    let component: SimpleChoiceComponent;
    let fixture: ComponentFixture<SimpleChoiceComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SimpleChoiceComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SimpleChoiceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
