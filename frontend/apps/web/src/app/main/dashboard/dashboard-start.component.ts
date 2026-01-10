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
    this.State.accountType = "CAS";
    this.flowService.navigate('money-transfer', true);
  }
  goToAccounts() {
    this.flowService.navigate('all-account');
  }
  goToAccountDetail() {
    this.flowService.navigate('account-detail');
  }
  goToApplyVehicleCredit() {
    this.flowService.navigate('apply-vehicle-credit');
  }
}
