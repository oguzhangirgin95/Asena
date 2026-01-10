import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from './base.component';
import { KeyValueListComponent } from '../ui/key-value-list/key-value-list.component';
import { ButtonComponent } from '../ui/button/button.component';
import { BaseExecuteResponse } from '../api/model/base-execute-response';
import { ResourceService } from '../services/resource.service';
import { FlowButton, FlowButtonVariant, FlowButtonVisibilityContext, FlowStep } from '../services/flow.service';
import { combineLatest, map, delay } from 'rxjs';

@Component({
  templateUrl: './execute.component.html',
  standalone: true,
  imports: [CommonModule, KeyValueListComponent, ButtonComponent]
})
export class ExecuteComponent extends BaseComponent implements OnInit {

  data: BaseExecuteResponse | undefined;

  currentStep$ = combineLatest([
    this.flowService.steps$,
    this.flowService.currentStepIndex$
  ]).pipe(
    map(([steps, index]) => steps[index]),
    delay(0)
  );

  visibleButtons$ = this.currentStep$.pipe(
    map((step) => this.getVisibleButtons(step)),
    delay(0)
  );

  constructor(
    public resourceService: ResourceService
  ) {
    super();
  }
  override ngOnInit(): void {
    super.ngOnInit();
    this.data = this.flowService.get<BaseExecuteResponse>('lastServiceResult');
  }

  onClose(): void {
    // Navigate to home or start of flow
    // For now, just log
    console.log('Flow finished');
  }

  getButtonLabel(labelKey: string): string {
    return this.resourceService.getMessage(labelKey);
  }

  getButtonVariant(button: FlowButton): FlowButtonVariant {
    return (button.variant ?? button.color ?? 'primary') as FlowButtonVariant;
  }

  private getVisibleButtons(step: FlowStep | undefined): FlowButton[] {
    const buttons = step?.buttons ?? [];
    return buttons.filter((btn) => this.isButtonVisible(btn));
  }

  private isButtonVisible(button: FlowButton): boolean {
    if (button.isVisible === undefined) return true;
    if (typeof button.isVisible === 'boolean') return button.isVisible;
    if (typeof button.isVisible === 'string') {
      return this.evalVisibilityExpression(button.isVisible);
    }

    const ctx: FlowButtonVisibilityContext = {
      get: this.flowService.get.bind(this.flowService),
    };

    try {
      return button.isVisible(ctx);
    } catch {
      return false;
    }
  }

  private evalVisibilityExpression(expr: string): boolean {
    const trimmed = (expr ?? '').toString().trim();
    if (!trimmed) return true;

    // Very small allow-list to avoid executing arbitrary code.
    const forbidden = /\b(new|function|class|constructor|prototype|__proto__|window|document|globalThis|self|import|eval|XMLHttpRequest|fetch|localStorage|sessionStorage)\b/;
    if (forbidden.test(trimmed)) return false;

    const allowedChars = /^[\w\s\.'"=!?&|()<>:\-+*/%\[\]]*$/;
    if (!allowedChars.test(trimmed)) return false;

    // Require that expression references State (prevents accidental free variables)
    if (!/\bState\b/.test(trimmed)) return false;

    try {
      const fn = new Function('State', `"use strict"; return (${trimmed});`);
      return Boolean(fn(this.State));
    } catch {
      return false;
    }
  }

  navigate(path: string, preserveState?: boolean): void {
    this.flowService.navigate(path, preserveState);
  }
}
