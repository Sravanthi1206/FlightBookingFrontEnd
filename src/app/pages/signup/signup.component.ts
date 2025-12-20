import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

/* Angular Material */
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']   
})
export class SignupComponent {

  username = '';
  password = '';
  email = '';
  
  loading = false;

  constructor(private auth: AuthService, private router: Router,  private snackBar: MatSnackBar
) {}

 signup(form: NgForm) {
  if (form.invalid) return;

  this.loading = true;

  this.auth.signup({
    username: this.username,
    password: this.password,
    email: this.email

  }).subscribe({
    next: () => {
      this.loading = false;
      this.snackBar.open(
        'Signup successful! Please login.',
        'OK',
        { duration: 3000 }
      );
      this.router.navigate(['/login']);
    },
    error: (err) => {
      this.loading = false;
      this.snackBar.open(
        err?.error?.message || 'Signup failed',
        'Close',
        { duration: 3000 }
      );
    }
  });
}

 
}
