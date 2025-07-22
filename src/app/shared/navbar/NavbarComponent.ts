import { inject, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuardService } from 'src/app/guards/AuthGuardService';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './NavbarComponent.html',
  styleUrls: ['./NavbarComponent.css'],
  imports: [CommonModule, RouterModule],
})
export class NavbarComponent {
  userName = '';
  private authGuard = inject(AuthGuardService);
  private router = inject(Router);

  ngOnInit(): void {
    this.userName = this.authGuard.getUser();
  }

  closeSession() {
    sessionStorage.removeItem('user');
    this.router.navigateByUrl('/login');
  }
}
