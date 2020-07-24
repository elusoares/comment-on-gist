import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    /* children: [
      {
        path: 'open-gist',
        loadChildren: () => import('../open-gist/open-gist.module').then( m => m.OpenGistPageModule)
      },
    ] */
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
