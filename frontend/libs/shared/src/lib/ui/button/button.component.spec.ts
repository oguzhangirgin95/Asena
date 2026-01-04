import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label', () => {
    component.label = 'Test Button';
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.textContent).toContain('Test Button');
  });

  it('should emit onClick when clicked', () => {
    fixture.detectChanges();
    const spy = vi.spyOn(component.onClick, 'emit');
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);
    expect(spy).toHaveBeenCalled();
  });

  it('should not emit onClick when disabled', () => {
    component.disabled = true;
    fixture.detectChanges();
    const spy = vi.spyOn(component.onClick, 'emit');
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should apply variant class', () => {
    component.variant = 'secondary';
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.classList).toContain('btn-secondary');
  });
});
