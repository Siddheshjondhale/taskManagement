import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './shared/not-found-page/not-found-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/task-manager', pathMatch: 'full' },
  {
    path: 'task-manager',
    loadChildren: () => import('./task-manager/task-manager.module').then(m => m.TaskManagerModule)
  },
  { path: '404', component: NotFoundPageComponent },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
