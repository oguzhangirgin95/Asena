import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '@frontend/shared';

@Component({
  selector: 'asena-dashboard-start',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-start.component.html',
  styleUrls: ['./dashboard-start.component.scss'],
})
export class DashboardStartComponent extends BaseComponent implements OnInit {
  override ngOnInit() {
    super.ngOnInit();
  }

  goToMoneyTransfer() {
    this.flowService.navigate('payment/money-transfer');
  }
}
