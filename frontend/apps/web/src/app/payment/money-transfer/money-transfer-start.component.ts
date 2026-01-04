import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent, ResourceService } from '@frontend/shared';

@Component({
  selector: 'asena-money-transfer-start',
  standalone: true,
  imports: [CommonModule],
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
  override ngOnInit() {
    super.ngOnInit();
    this.title = this.resourceService.getMessage('MoneyTransferTitle | Money Transfer');
    this.State.transferRequest = {
      amount: 10,
      iban: 'TR5647273823239723978'
    };
  }
}
