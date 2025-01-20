import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskAddFormComponent } from './task-add-form/task-add-form.component';
import { TaskConfirmationDialogComponent } from './task-confirmation-dialog/task-confirmation-dialog.component';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { TaskEditFormComponent } from './task-edit-form/task-edit-form.component';
import { TaskManagerComponent } from './task-manager.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';

const routes: Routes = [
  {path:'', component: TaskManagerComponent},
  {path:'task', component: TaskAddFormComponent},
  {path:'task/:id', component: TaskEditFormComponent}
];

@NgModule({
  declarations: [
    TaskManagerComponent,
    TaskDialogComponent,
    TaskConfirmationDialogComponent,
    TaskAddFormComponent,
    TaskEditFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    FlexLayoutModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class TaskManagerModule { }
