import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DragAndDropComponent} from '../drag-and-drop/drag-and-drop.component';

describe('DragAndDropComponent', () => {
    let component: DragAndDropComponent;
    let fixture: ComponentFixture<DragAndDropComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DragAndDropComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DragAndDropComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
