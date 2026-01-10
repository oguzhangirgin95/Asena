import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LabelComponent } from './label.component';

describe('LabelComponent', () => {
  let component: LabelComponent;
  let fixture: ComponentFixture<LabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabelComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render text when provided', () => {
    component.text = 'My Label';
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('label')).nativeElement as HTMLLabelElement;
    expect(label.textContent).toContain('My Label');
  });

  it('should set for attribute when forId is provided', () => {
    component.text = 'My Label';
    component.forId = 'amount';
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('label')).nativeElement as HTMLLabelElement;
    expect(label.getAttribute('for')).toBe('amount');
  });
});
