import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent, AuthService, ResourcePipe, ResourceService, AutofocusDirective, TrimRequiredValidatorDirective } from '@frontend/shared';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'asena-login-start',
  standalone: true,
  imports: [CommonModule, FormsModule, ResourcePipe, AutofocusDirective, TrimRequiredValidatorDirective],
  templateUrl: './login-start.component.html',
  styleUrls: ['./login-start.component.scss'],
})
export class LoginStartComponent extends BaseComponent implements OnInit {
  credentials = {
    username: '',
    password: ''
  };
  error: string | null = null;
  languages = [
    { code: 'tr', name: 'tr' },
    { code: 'en', name: 'en' }
  ];
  constructor(
    private authService: AuthService,
    public resourceService: ResourceService
  ) {
    super();
  }

  get crmMessage(): string | null {
    const value = this.SharedState.crmMessage;
    if (value === null || value === undefined) return null;
    const s = String(value).trim();
    return s ? s : null;
  }

  get crossAppSessionId(): string | null {
    const value = this.SharedState.crossAppSessionId;
    if (value === null || value === undefined) return null;
    const s = String(value).trim();
    return s ? s : null;
  }

  override ngOnInit() {
    super.ngOnInit();
    // Do not restrict origins here to avoid localhost/127.0.0.1 mismatches in dev.
    this.enableCrossAppStateReceiver();
  }

  changeLanguage(lang: string) {
    this.resourceService.setLanguage(lang).catch(() => undefined);
  }

  onLogin() {
    if (this.validationService.Validate()) {
      this.authService.login(this.credentials).subscribe({
        next: () => {
          this.flowService.navigate('dashboard');
        },
        error: (err) => {
          this.error = 'Login failed. Please check your credentials.';
          console.error('Login error:', err);
        }
      });
    }
  }
}
