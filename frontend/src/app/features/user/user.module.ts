import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [UserSettingsComponent],
  imports: [CommonModule, UserRoutingModule, SharedModule, FormsModule],
})
export class UserModule {}
