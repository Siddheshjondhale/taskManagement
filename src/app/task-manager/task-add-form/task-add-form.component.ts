import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TasksService } from 'src/app/shared/services/task-manager/tasks.service';
import { TaskModel } from 'src/app/shared/models/task-model';

@Component({
  selector: 'app-task-add-form',
  templateUrl: './task-add-form.component.html',
  styleUrls: ['./task-add-form.component.scss']
})
export class TaskAddFormComponent implements OnInit {
  taskManagerFormGroup = this._formBuilder.group({
    entityName: [null, Validators.required],
    taskType: [null, Validators.required],
    contactPerson: [null, Validators.required],
    timeOfTask: new FormControl(null, Validators.required),  // Change here
    note: [null],  // Optional field for the note
    status: ['open']  // default to 'open'
  });

  tagsFormGroup = this._formBuilder.group({
    tag: [[], Validators.required]
  });

  constructor(
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private taskService: TasksService
  ) {}

  ngOnInit(): void {}

  save(): void {
    const task: TaskModel = this.taskManagerFormGroup.value;

  
    // Send the task to the backend
    this.taskService.addTask(task).subscribe({
      next: (data) => {
        if (data) {
          this._router.navigate(['/']).then(() => {
            this.openSnackBar("Task created successfully", "Close");
          });
        }
      },
      error: (error) => {
        this.openSnackBar("Error occurred while saving task: " + error?.message, "Close");
      }
    });
  }

  openSnackBar(message: string, action: string): void {
    const snackBarOpt: MatSnackBarConfig = {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    };
    this._snackBar.open(message, action, snackBarOpt);
  }

  onBack(): void {
    this._router.navigate(['/']);
  }
}
