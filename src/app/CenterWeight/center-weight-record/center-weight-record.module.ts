import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CenterWeightRecordPageRoutingModule } from './center-weight-record-routing.module';

import { CenterWeightRecordPage } from './center-weight-record.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CenterWeightRecordPageRoutingModule
  ],
  declarations: [CenterWeightRecordPage]
})
export class CenterWeightRecordPageModule {}
