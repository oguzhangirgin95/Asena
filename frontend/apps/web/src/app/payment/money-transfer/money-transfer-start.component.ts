import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent, LabelComponent, ResourceService } from '@frontend/shared';

@Component({
  selector: 'asena-money-transfer-start',
  standalone: true,
  imports: [CommonModule, LabelComponent],
  templateUrl: './money-transfer-start.component.html',
  styleUrls: ['./money-transfer-start.component.scss'],
})
export class MoneyTransferStartComponent
  extends BaseComponent
  implements OnInit {
  constructor(
    public resourceService: ResourceService
  ) {
    super();
  }

  title: string = '';

  transferRequestttttSig:any;

  transferRequestttttSnapshot: any;

  override ngOnInit() {
    super.ngOnInit();
    this.title = this.resourceService.getMessage('MoneyTransferTitle | Money Transfer');
    this.State.transferRequest = {
      amount: 10,
      iban: 'TR5647273823239723978',
      fromAccountType: 'ACCOUNT'
    };

    this.State.transferRequesttttt = {
      amount: 103455,
      iban: 'TR5647273823239723978465464646',
      fromAccountType: 'ACCOUNTssssssss'
    };

    this.transferRequestttttSnapshot = this.flowService.get<any>('transferRequesttttt');
    this.transferRequestttttSig = this.flowService.select<any>('transferRequesttttt');
  }

  changeit() {
    this.State.transferRequesttttt = {
      amount: 999999,
      iban: 'CH9999999999999999999999',
      fromAccountType: 'ACCOUNT_CHANGED'
    };
  }
}
