import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './core/interceptors/token.interceptor';
import { AuthModule } from './features/auth/auth.module';
import { HomeModule } from './features/home/home.module';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { EditorLayoutComponent } from './layouts/editor-layout/editor-layout.component';
import { QuillModule } from 'ngx-quill';
import { CoreModule } from './core/core.module';
import { UserModule } from './features/user/user.module';
@NgModule({
  declarations: [
    AppComponent,
    PublicLayoutComponent,
    AuthLayoutComponent,
    DashboardLayoutComponent,
    EditorLayoutComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    AuthModule,
    UserModule,
    HomeModule,
    QuillModule.forRoot(),
    CoreModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
