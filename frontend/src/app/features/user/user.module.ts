import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [UserSettingsComponent],
  imports: [CommonModule, UserRoutingModule, SharedModule],
})
export class UserModule {}
