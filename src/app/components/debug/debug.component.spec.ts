import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DebugComponent } from './debug.component';

describe('DebugComponent', () => {
  let component: DebugComponent;
  let fixture: ComponentFixture<DebugComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebugComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DebugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
