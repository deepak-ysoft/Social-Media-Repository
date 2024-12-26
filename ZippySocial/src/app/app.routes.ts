import { Routes } from '@angular/router';
import { LoginComponent } from './Components/user/login/login.component';
import { DashboardComponent } from './Components/Home/dashboard/dashboard.component';
import { RegisterComponent } from './Components/user/register/register.component';
import { UsersListComponent } from './Components/user/users-list/users-list.component';
import { LayoutComponent } from './Components/Layout/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'index', // Redirect '' within LayoutComponent to 'index'
        pathMatch: 'full',
      },
      {
        path: 'index',
        component: DashboardComponent,
      },
    ],
  },
  {
    path: 'userList',
    component: UsersListComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
];
