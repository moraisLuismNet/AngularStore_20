import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/AppCompondent';
import { importProvidersFrom, inject } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Routes } from '@angular/router';
import { LoginComponent } from './app/start/login/LoginComponent';
import { NotFoundComponent } from './app/start/not-found/NotFoundComponent';
import { StoreComponent } from './app/store/StoreComponent';
import { CategoriesComponent } from './app/store/categories/CategoriesComponent';
import { ProductsComponent } from './app/store/products/ProductsComponent';
import { AuthGuardService } from './app/guards/AuthGuardService';

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
