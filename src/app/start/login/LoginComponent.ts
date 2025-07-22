import { inject, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import {
  LoginInterface,
  LoginResponseInterface,
} from 'src/app/interfaces/LoginInterface';
import { AppService } from 'src/app/services/AppService';
import { AuthGuardService } from 'src/app/guards/AuthGuardService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  templateUrl: './LoginComponent.html',
  styleUrls: ['./LoginComponent.css'],
  providers: [MessageService],
  imports: [CommonModule, FormsModule, ToastModule],
})
export class LoginComponent implements OnInit {
  infoLogin: LoginInterface = {
    email: '',
    password: '',
  };

  private router = inject(Router);
  private appService = inject(AppService);
  private messageService = inject(MessageService);
  private authGuard = inject(AuthGuardService);

  ngOnInit() {
    if (this.authGuard.isLoggedIn()) {
      this.router.navigateByUrl('store/categories');
    }
  }

  login() {
    this.appService.login(this.infoLogin).subscribe({
      next: (data) => {
        sessionStorage.setItem('user', JSON.stringify(data));
        this.router.navigate([`/store`], { replaceUrl: true });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Wrong credentials',
        });
      },
    });
  }
}
