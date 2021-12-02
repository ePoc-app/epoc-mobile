import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AssessmentContentComponent } from './assessment.component';

describe('AssessmentContentComponent', () => {
  let component: AssessmentContentComponent;
  let fixture: ComponentFixture<AssessmentContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentContentComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
