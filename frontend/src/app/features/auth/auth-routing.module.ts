import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loginAuthGuard } from 'src/app/core/guards/login-auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NovelRoutingModule } from '../novel/novel-routing.module';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginAuthGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [loginAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), NovelRoutingModule],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
