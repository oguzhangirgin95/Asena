import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlowNavigation } from './flow-navigation';

describe('FlowNavigation', () => {
  let component: FlowNavigation;
  let fixture: ComponentFixture<FlowNavigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlowNavigation],
    }).compileComponents();

    fixture = TestBed.createComponent(FlowNavigation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
