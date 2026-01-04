import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from './base.component';
import { KeyValueListComponent } from '../ui/key-value-list/key-value-list.component';
import { BaseConfirmResponse } from '../api/model/base-confirm-response';

@Component({
  templateUrl: './confirm.component.html',
  standalone: true,
  imports: [CommonModule, KeyValueListComponent]
})
export class ConfirmComponent extends BaseComponent implements OnInit {
  data: BaseConfirmResponse | undefined;

  override ngOnInit(): void {
    super.ngOnInit();
    const result = this.flowService.get<BaseConfirmResponse>('lastServiceResult');
    console.log('ConfirmComponent: lastServiceResult', result);
    this.data = result;
  }
}
