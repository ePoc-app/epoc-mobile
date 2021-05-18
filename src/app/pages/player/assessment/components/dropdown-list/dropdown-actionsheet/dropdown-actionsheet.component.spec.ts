import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DropdownActionsheetComponent } from './dropdown-actionsheet.component';

describe('DropdownActionsheetComponent', () => {
  let component: DropdownActionsheetComponent;
  let fixture: ComponentFixture<DropdownActionsheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownActionsheetComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownActionsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
