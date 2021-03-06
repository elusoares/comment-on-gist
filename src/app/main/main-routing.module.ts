import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationGuard } from '../shared/authentication/authentication-guard/authentication.guard';
import { RootComponent } from './root/root.component';
import { HomePage } from './home/home.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/root/home',
    pathMatch: 'full'
  },
  {
    path: 'root',
    component: RootComponent,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
          },
          {
            path: 'open-gist',
            loadChildren: () => import('./open-gist/open-gist.module').then(m => m.OpenGistPageModule)
          }
        ] 
      },
      {
        path: 'open-gist',
        loadChildren: () => import('./open-gist/open-gist.module').then(m => m.OpenGistPageModule)
      },
      {
        path: 'qr-scanner',
        loadChildren: () => import('./qr-scanner/qr-scanner.module').then( m => m.QrScannerPageModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
      },
    ],
    canActivate: [
      AuthenticationGuard
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class MainRoutingModule { }
