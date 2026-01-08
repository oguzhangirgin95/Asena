import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent, ResourceService } from '@frontend/shared';

@Component({
  selector: 'asena-money-transfer-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './money-transfer-contact.component.html',
  styleUrls: ['./money-transfer-contact.component.scss'],
})
export class MoneyTransferContactComponent
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
    this.title = this.resourceService.getMessage('MoneyTransferContactTitle | Money Transfer Contact');
  }
}
