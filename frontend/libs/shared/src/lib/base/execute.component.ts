import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from './base.component';
import { KeyValueListComponent } from '../ui/key-value-list/key-value-list.component';
import { ButtonComponent } from '../ui/button/button.component';
import { BaseExecuteResponse } from '../api/model/base-execute-response';

@Component({
  templateUrl: './execute.component.html',
  standalone: true,
  imports: [CommonModule, KeyValueListComponent, ButtonComponent]
})
export class ExecuteComponent extends BaseComponent implements OnInit {
  data: BaseExecuteResponse | undefined;

  override ngOnInit(): void {
    super.ngOnInit();
    this.data = this.flowService.get<BaseExecuteResponse>('lastServiceResult');
  }

  onClose(): void {
    // Navigate to home or start of flow
    // For now, just log
    console.log('Flow finished');
  }
}
