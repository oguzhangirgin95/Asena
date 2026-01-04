import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '@frontend/shared';

@Component({
  selector: 'asena-apply-vehicle-credit-start',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './apply-vehicle-credit-start.component.html',
  styleUrls: ['./apply-vehicle-credit-start.component.scss'],
})
export class ApplyVehicleCreditStartComponent
  extends BaseComponent
  implements OnInit
{
  constructor() {
    super();
  }
  override ngOnInit() {
    super.ngOnInit();
  }
}
