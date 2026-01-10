import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-label',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
})
export class LabelComponent {
  @Input() text: string = '';
  @Input() forId: string | null = null;
}
