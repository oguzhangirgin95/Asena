import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '@frontend/shared';

@Component({
  selector: 'asena-all-account-start',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-account-start.component.html',
  styleUrls: ['./all-account-start.component.scss'],
})
export class AllAccountStartComponent extends BaseComponent implements OnInit {
  public readonly transferRequesttttt = this.flowService.select<any>('transferRequesttttt');
  constructor() {
    super();
  }
  override ngOnInit() {
    super.ngOnInit();
    console.log(this.State.transferRequest);
  }
}
