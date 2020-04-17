import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ReorderComponent} from '../reorder/reorder.component';

describe('ReorderComponent', () => {
    let component: ReorderComponent;
    let fixture: ComponentFixture<ReorderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ReorderComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReorderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
