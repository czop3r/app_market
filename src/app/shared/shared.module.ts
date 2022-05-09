import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '../material.module';

const moduleArr: Array<any> = [
  CommonModule,
  FormsModule,
  MaterialModule,
  FlexLayoutModule,
];

@NgModule({
  imports: moduleArr,
  exports: moduleArr,
})
export class SharedModule {}
