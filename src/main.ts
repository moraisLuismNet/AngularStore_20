import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { importProvidersFrom, inject } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Routes } from '@angular/router';
import { LoginComponent } from './app/start/login/login';
import { NotFoundComponent } from './app/start/not-found/not-found';
import { StoreComponent } from './app/store/store';
import { CategoriesComponent } from './app/store/categories/categories';
import { ProductsComponent } from './app/store/products/products';
import { AuthGuardService } from './app/guards/auth-guard';

export const canActivate = () => inject(AuthGuardService).isLoggedIn();

const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'store',
    component: StoreComponent,
    canActivate: [canActivate],
    children: [
      { path: '', redirectTo: '/store/categories', pathMatch: 'full' },
      { path: 'categories', component: CategoriesComponent },
      { path: 'products', component: ProductsComponent },
    ],
  },
  { path: '**', component: NotFoundComponent },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(),
    importProvidersFrom(BrowserAnimationsModule),
    providePrimeNG(),
  ],
}).catch((err) => console.error(err));
