import { CurrentYearComponent } from './current-year.component';
import { TestBed } from '@angular/core/testing';

describe('CurrentYearComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const component: CurrentYearComponent = TestBed.get(CurrentYearComponent);
    expect(component).toBeTruthy();
  });
});
