import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { ButtonComponent } from '../button/button.component';
import { StepIndicator } from '../step-indicator/step-indicator.component';
import { FlowService } from '../../services/flow.service';
import { AuthService } from '../../services/auth.service';
import { combineLatest, map, delay } from 'rxjs';

@Component({
  selector: 'lib-transaction-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent, ButtonComponent, StepIndicator],
  templateUrl: './transaction-layout.component.html',
  styleUrl: './transaction-layout.component.css',
})
export class TransactionLayout {
  private flowService = inject(FlowService);
  private authService = inject(AuthService);
  private router = inject(Router);

  get showLayout(): boolean {
    return this.authService.isAuthenticated() && !this.router.url.includes('login');
  }

  disableLayout$ = combineLatest([
    this.flowService.steps$,
    this.flowService.currentStepIndex$
  ]).pipe(
    map(([steps, currentIndex]) => {
      const currentStep = steps[currentIndex];
      if (!currentStep) return false;
      
      return currentStep.disableLayout;
    }),
    delay(0)
  );

  showContinueButton$ = combineLatest([
    this.flowService.steps$,
    this.flowService.currentStepIndex$
  ]).pipe(
    map(([steps, currentIndex]) => {
      const currentStep = steps[currentIndex];
      if (!currentStep) return false;
      
      // If explicitly set in config, use it
      if (currentStep.showContinueButton !== undefined) {
        return currentStep.showContinueButton;
      }
      
      // Default behavior: show unless it's 'execute' step
      return currentStep.step !== 'execute';
    }),
    delay(0)
  );

  showBackButton$ = combineLatest([
    this.flowService.steps$,
    this.flowService.currentStepIndex$
  ]).pipe(
    map(([steps, currentIndex]) => {
      const currentStep = steps[currentIndex];
      if (!currentStep) return false;

      // If explicitly set in config, use it
      if (currentStep.showBackButton !== undefined) {
        return currentStep.showBackButton;
      }

      // Default behavior: show if not first step
      // return currentIndex > 0;
      return true;
    }),
    delay(0)
  );

  onContinue() {
    this.flowService.next();
  }

  onBack() {
    this.flowService.back();
  }
}
