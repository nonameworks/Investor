import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialValuesComponent } from './initial-values.component';

describe('InitialValuesComponent', () => {
  let component: InitialValuesComponent;
  let fixture: ComponentFixture<InitialValuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialValuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
