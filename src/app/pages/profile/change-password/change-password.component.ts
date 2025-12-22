import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  status: 'idle' | 'working' | 'success' | 'error' = 'idle';
  message = '';

  form!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmNewPassword: ['', [Validators.required]]
    }, { validators: [ChangePasswordComponent.matchPasswords] });
  }

  static matchPasswords(group: any) {
    const np = group.get('newPassword')?.value;
    const cp = group.get('confirmNewPassword')?.value;
    return np === cp ? null : { passwordMismatch: true };
  }

  get f() { return this.form.controls; }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { currentPassword, newPassword } = this.form.value as any;
    this.status = 'working';
    this.message = '';

    this.auth.changePassword(currentPassword, newPassword).subscribe({
      next: (res) => {
        this.status = 'success';
        this.message = 'Password changed successfully';
        setTimeout(() => this.router.navigate(['/profile']), 1000);
      },
      error: (err) => {
        this.status = 'error';
        this.message = typeof err?.error === 'string' ? err.error : 'Failed to change password';
      }
    });
  }
}
