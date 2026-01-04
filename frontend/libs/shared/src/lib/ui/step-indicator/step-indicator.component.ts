import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowService } from '../../services/flow.service';

@Component({
  selector: 'lib-step-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-indicator.component.html',
  styleUrl: './step-indicator.component.css',
})
export class StepIndicator {
  flowService = inject(FlowService);
  
  steps$ = this.flowService.steps$;
  currentStepIndex$ = this.flowService.currentStepIndex$;
}
