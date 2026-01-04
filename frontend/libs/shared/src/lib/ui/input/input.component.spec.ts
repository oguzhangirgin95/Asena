import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { vi } from 'vitest';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label', () => {
    component.label = 'Test Label';
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('label')).nativeElement;
    expect(label.textContent).toContain('Test Label');
  });

  it('should write value', () => {
    component.writeValue('test value');
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(input.value).toBe('test value');
  });

  it('should call onChange when input changes', () => {
    fixture.detectChanges();
    const spy = vi.fn();
    component.registerOnChange(spy);
    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.value = 'new value';
    input.triggerEventHandler('input', { target: input.nativeElement });
    expect(spy).toHaveBeenCalledWith('new value');
  });

  it('should call onTouched when input blurs', () => {
    fixture.detectChanges();
    const spy = vi.fn();
    component.registerOnTouched(spy);
    const input = fixture.debugElement.query(By.css('input'));
    input.triggerEventHandler('blur', {});
    expect(spy).toHaveBeenCalled();
  });

  it('should set disabled state', () => {
    component.setDisabledState!(true);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(input.disabled).toBe(true);
  });
});
