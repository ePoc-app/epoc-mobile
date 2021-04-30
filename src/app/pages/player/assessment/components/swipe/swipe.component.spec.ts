import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SwipeComponent } from './swipe.component';
import {SwipeCard} from "../../../../../classes/contents/assessment";

describe('SwipeComponent', () => {
  let component: SwipeComponent;
  let fixture: ComponentFixture<SwipeComponent>;
  const c1 = new SwipeCard();
  const c2 = new SwipeCard();
  const c3 = new SwipeCard();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwipeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SwipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Cas de tests pour la méthode undo()
  component.cartesRestantes = [this.c2, this.c3];
  component.cartesTriees = [this.c1];
  component.undo();
  it('should undo', () => {
    expect(component.cartesTriees).toBe([]);
    expect(component.cartesRestantes).toBe([this.c1, this.c2, this.c3]);
  })
  component.cartesRestantes = [this.c1, this.c2, this.c3];
  component.cartesTriees = [];
  component.undo();
  it('should not undo', () => {
    expect(Error);
  })
});
