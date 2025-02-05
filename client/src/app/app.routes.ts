import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    // canActivate: [authGuard],
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }
];
