import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    NotFoundPageComponent
  ],
  imports: [
    FlexLayoutModule,
    MaterialModule,
    RouterModule
  ],
  exports:[
    NotFoundPageComponent
  ]
})
export class SharedModule { }
