import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceService } from '../../services/resource.service';

@Component({
  selector: 'lib-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  protected resourceService = inject(ResourceService);
}
