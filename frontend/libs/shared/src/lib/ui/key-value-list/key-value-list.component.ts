import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyValueDto } from '../../api/model/key-value-dto';

@Component({
  selector: 'lib-key-value-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './key-value-list.component.html',
  styleUrl: './key-value-list.component.css'
})
export class KeyValueListComponent {
  @Input() items: KeyValueDto[] = [];
}
