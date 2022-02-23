import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CenterWeightRecordPage } from './center-weight-record.page';

const routes: Routes = [
  {
    path: '',
    component: CenterWeightRecordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CenterWeightRecordPageRoutingModule {}
