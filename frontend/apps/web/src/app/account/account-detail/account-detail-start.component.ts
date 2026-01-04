import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '@frontend/shared';

@Component({
  selector: 'asena-account-detail-start',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-detail-start.component.html',
  styleUrls: ['./account-detail-start.component.scss'],
})
export class AccountDetailStartComponent
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
