import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';

/* Angular Material */
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    MatToolbarModule,  
    MatButtonModule, 
    MatSnackBarModule  
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {}
