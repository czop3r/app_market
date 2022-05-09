import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { SettingsRoutigModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';

@NgModule({
  declarations: [SettingsComponent, SettingsDialogComponent],
  imports: [SharedModule, SettingsRoutigModule],
})
export class SettingsModule {}
