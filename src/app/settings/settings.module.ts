import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { SettingsRoutigModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { SettingsUserDialogComponent } from './settings-user-dialog/settings-user-dialog.component';

@NgModule({
  declarations: [SettingsComponent, SettingsDialogComponent, SettingsUserDialogComponent],
  imports: [SharedModule, SettingsRoutigModule],
})
export class SettingsModule {}
