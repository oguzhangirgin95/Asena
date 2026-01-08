import { Component, Input, Output, EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceService } from '../../services/resource.service';

@Component({
  selector: 'lib-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit, OnChanges {
  @Input() label: string = '';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled: boolean = false;
  @Input() variant: 'primary' | 'secondary' | 'outline' = 'primary';

  @Output() onClick = new EventEmitter<Event>();

  text: string = '';
  buttonClass = 'btn btn-primary';

  constructor(private resourceService: ResourceService) {}

  ngOnInit(): void {
    this.updateText();
    this.updateButtonClass();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['label']) {
      this.updateText();
    }

    if (changes['variant']) {
      this.updateButtonClass();
    }
  }

  private updateText(): void {
    this.text = this.resourceService.getMessage(this.label);
  }

  private updateButtonClass(): void {
    const variantClass =
      this.variant === 'secondary'
        ? 'btn-secondary'
        : this.variant === 'outline'
          ? 'btn-outline-primary'
          : 'btn-primary';

    this.buttonClass = `btn ${variantClass}`;
  }
  
  handleClick(event: Event) {
    if (!this.disabled) {
      this.onClick.emit(event);
    }
  }
}
