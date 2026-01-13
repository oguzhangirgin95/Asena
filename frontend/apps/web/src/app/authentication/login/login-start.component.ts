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

  override ngOnInit() {
    super.ngOnInit();
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
