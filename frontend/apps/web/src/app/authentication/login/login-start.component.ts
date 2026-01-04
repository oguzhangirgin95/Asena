import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent, AuthService } from '@frontend/shared';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'asena-login-start',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-start.component.html',
  styleUrls: ['./login-start.component.scss'],
})
export class LoginStartComponent extends BaseComponent implements OnInit {
  credentials = {
    username: '',
    password: ''
  };
  error: string | null = null;

  constructor(
    private authService: AuthService
  ) {
    super();
  }

  override ngOnInit() {
    super.ngOnInit();
  }

  onLogin() {
    if (this.validationService.Validate()) {
      this.authService.login(this.credentials).subscribe({
        next: () => {
          this.flowService.navigate('main/dashboard');
        },
        error: (err) => {
          this.error = 'Login failed. Please check your credentials.';
          console.error('Login error:', err);
        }
      });
    }
  }
}
