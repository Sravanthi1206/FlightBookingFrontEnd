import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

/* Angular Material */
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username = '';
  password = '';
  email = '';
  error: string | null = null;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login() {
    this.error = null;

    this.auth.login(this.username, this.password,this.email).subscribe({
      next: (res: any) => {
        this.auth.setToken(res.token);
        this.router.navigate(['/flights']); 
      },
      error: () => {
        this.error = 'Invalid username or password';
      }
    });
  }
}
