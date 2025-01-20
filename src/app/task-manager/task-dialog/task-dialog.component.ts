import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskConfirmationDialogComponent } from '../task-confirmation-dialog/task-confirmation-dialog.component';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { TasksService } from 'src/app/shared/services/task-manager/tasks.service';
import { TaskModel } from 'src/app/shared/models/task-model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
})
export class TaskDialogComponent implements OnInit {

  taskManagerFormGroup = this._formBuilder.group({
    taskName : [null, Validators.required],
    taskDescription : [null, Validators.required],
    status : [0]
  });
  
  tagsFormGroup = this._formBuilder.group({
    tag : [[]]
  });

  // taskManagerFormGroup = new FormGroup({
  //   taskName : new FormControl(null, Validators.required),
  //   taskDescription: new FormControl(null, Validators.required)
  // });

  task:TaskModel[] = [];

  constructor(private _snackBar: MatSnackBar, 
              private _formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<TaskDialogComponent>, // to close dialog
              @Inject(MAT_DIALOG_DATA) public data: any,) 
              { 
                
              }

  ngOnInit(): void {
    this.setValue();
  }

  setValue(){
    if(this.data.header === 'Edit')
    {
      this.taskManagerFormGroup.controls['taskName'].setValue(this.data.task.taskName);
      this.taskManagerFormGroup.controls['taskDescription'].setValue(this.data.task.taskDescription);
      this.taskManagerFormGroup.controls['status'].setValue(this.data.task.status.toString());
      this.tagsFormGroup.controls['tag'].setValue(this.data.task.tag);
    }
  }
  
  save(action : string, id?: string){
    let task = this.taskManagerFormGroup.value;
    let tagFormGroup = this.tagsFormGroup.controls['tag'].value as [];

    task.tag = tagFormGroup.map(tag => ({ tagName: tag['tagName'] }));
    if(action === 'Edit'){
      let status = task.status;
      (status === "0" ? task.status = 0 : status === "1" ? task.status = 1 : task.status = 2);
      task.taskId = id;
    }

    this.cancel(task);  
    this.openSnackBar("Task saved successfully", "Close");
  }

  cancel(data?:any){
    this.dialogRef.close(data);
  }

  openSnackBar(message: string, action: string) {
    let snackBarRef = this._snackBar.open(message, action,{
      duration: 5000
    });

    snackBarRef.onAction().subscribe(() =>{
      snackBarRef.dismiss();
    });
  }
}
