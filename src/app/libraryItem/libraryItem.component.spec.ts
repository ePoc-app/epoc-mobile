import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LibraryItemComponent } from './libraryItem.component';

describe('LibraryItemComponent', () => {
  let component: LibraryItemComponent;
  let fixture: ComponentFixture<LibraryItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LibraryItemComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LibraryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
