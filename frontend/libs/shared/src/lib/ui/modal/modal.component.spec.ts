import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show modal when isOpen is false', () => {
    component.isOpen = false;
    fixture.detectChanges();
    const modal = fixture.debugElement.query(By.css('.modal-overlay'));
    expect(modal).toBeNull();
  });

  it('should show modal when isOpen is true', () => {
    component.isOpen = true;
    fixture.detectChanges();
    const modal = fixture.debugElement.query(By.css('.modal-overlay'));
    expect(modal).toBeTruthy();
  });

  it('should render title', () => {
    component.isOpen = true;
    component.title = 'Test Title';
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.modal-title')).nativeElement;
    expect(title.textContent).toContain('Test Title');
  });

  it('should emit close when close button clicked', () => {
    component.isOpen = true;
    fixture.detectChanges();
    const spy = vi.spyOn(component.close, 'emit');
    const closeBtn = fixture.debugElement.query(By.css('.modal-close'));
    closeBtn.triggerEventHandler('click', null);
    expect(spy).toHaveBeenCalled();
  });

  it('should emit close when overlay clicked', () => {
    component.isOpen = true;
    fixture.detectChanges();
    const spy = vi.spyOn(component.close, 'emit');
    const overlay = fixture.debugElement.query(By.css('.modal-overlay'));
    // Simulate click on overlay
    overlay.nativeElement.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should not emit close when container clicked', () => {
    component.isOpen = true;
    fixture.detectChanges();
    const spy = vi.spyOn(component.close, 'emit');
    const container = fixture.debugElement.query(By.css('.modal-container'));
    container.nativeElement.click();
    expect(spy).not.toHaveBeenCalled();
  });
});
