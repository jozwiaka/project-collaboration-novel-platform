import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoutingModule } from './features/auth/auth-routing.module';
import { HomeRoutingModule } from './features/home/home-routing.module';
import { UserRoutingModule } from './features/user/user-routing.module';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AuthRoutingModule,
    HomeRoutingModule,
    UserRoutingModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
