import { Routes } from '@angular/router';
import { Register } from './component/register/register';
import { Login } from './component/login/login';

export const routes: Routes = [
    {path: 'register', component: Register},
    {path: 'login', component: Login}
];
