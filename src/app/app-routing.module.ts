import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'loginpage',
    pathMatch: 'full'
  },

  {
    path: 'loginpage',
    loadChildren: () => import('./login-page/login-page.module').then(m => m.LoginPagePageModule)
  },
 
  {
    path: 'centerweight-auto-dashboard',
    loadChildren: () => import('./CenterWeight/CenterWeightAuto/dashboard/dashboard.module').then(m => m.DashboardPageModule)
  },
  {
    path: 'centerweight-auto-weighter',
    loadChildren: () => import('./CenterWeight/CenterWeightAuto/weighter/weighter.module').then(m => m.WeighterPageModule)
  },

  {
    path: 'weighter-report',
    loadChildren: () => import('./CenterWeight/weighter-report/weighter-report.module').then(m => m.WeighterReportPageModule)
  },
  {
    path: 'centerweight-manual-weighter',
    loadChildren: () => import('./CenterWeight/CenterWeightManual/center-manual-weighter/center-manual-weighter.module').then(m => m.CenterManualWeighterPageModule)
  },
 
 
  {
    path: 'admindashboard',
    loadChildren: () => import('./admin/admindashboard/admindashboard.module').then(m => m.AdmindashboardPageModule)
  },
  {
    path: 'user-creation',
    loadChildren: () => import('./admin/user-creation/user-creation.module').then(m => m.UserCreationPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'center-weight-record',
    loadChildren: () => import('./CenterWeight/center-weight-record/center-weight-record.module').then( m => m.CenterWeightRecordPageModule)
  },

  

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
