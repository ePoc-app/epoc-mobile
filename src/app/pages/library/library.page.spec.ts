import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LibraryPage } from './library.page';

describe('LibraryPage', () => {
  let component: LibraryPage;
  let fixture: ComponentFixture<LibraryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibraryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LibraryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
