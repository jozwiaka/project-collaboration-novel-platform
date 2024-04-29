import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { SettingsComponent } from './components/settings/settings.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [SettingsComponent],
  imports: [CommonModule, UserRoutingModule, SharedModule],
})
export class UserModule {}
