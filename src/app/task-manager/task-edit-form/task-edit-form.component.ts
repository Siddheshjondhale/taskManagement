import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from 'src/app/shared/services/task-manager/tasks.service';
import { TaskModel } from 'src/app/shared/models/task-model';

@Component({
  selector: 'app-task-edit-form',
  templateUrl: './task-edit-form.component.html',
  styleUrls: ['./task-edit-form.component.scss']
})
export class TaskEditFormComponent implements OnInit {
  taskManagerFormGroup = this._formBuilder.group({
    taskId: [null],
    entityName: [null, Validators.required],
    taskType: [null, Validators.required],
    contactPerson: [null, Validators.required],
    timeOfTask: [null, Validators.required],  // Make sure to handle Date correctly
    note: [null],  // Optional note
    status: ['open']  // Default to 'open'
  });

  constructor(
    private _snackBar: MatSnackBar,
    private _route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private taskService: TasksService
  ) { }

  ngOnInit(): void {
    const taskId = this._route.snapshot.paramMap.get('id');
    if (taskId) {
      this.setValue(taskId);
    }
  }
  
  setValue(id: string): void {
    this.taskService.getTableDataById(id).subscribe({
      next: (data) => {
        if (data) {
          // Assuming `data` is a TaskModel object
          this.taskManagerFormGroup.controls['entityName'].setValue(data.entityName);
          this.taskManagerFormGroup.controls['taskType'].setValue(data.taskType);
          this.taskManagerFormGroup.controls['contactPerson'].setValue(data.contactPerson);
          this.taskManagerFormGroup.controls['timeOfTask'].setValue(new Date(data.timeOfTask));  // Convert string to Date
          this.taskManagerFormGroup.controls['note'].setValue(data.note);
          this.taskManagerFormGroup.controls['status'].setValue(data.status);
          this.taskManagerFormGroup.controls['taskId'].setValue(data.taskId);
        }
      }
    });
  }

  save(): void {
    const task: TaskModel = this.taskManagerFormGroup.value;

    // Ensure status is in correct format ('open' | 'closed')
    task.status = task.status === 'open' || task.status === 'closed' ? task.status : 'open';

    this.taskService.editTask(task, task.taskId).subscribe({
      next: (data) => {
        if (data) {
          this._router.navigate(['/']).then(() => {
            this.openSnackBar("Task updated successfully", "Close");
          });
        }
      }
    });
  }

  onBack(): void {
    this._router.navigate(['/']);
  }

  openSnackBar(message: string, action: string): void {
    const snackBarOpt: MatSnackBarConfig = {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    };

    this._snackBar.open(message, action, snackBarOpt);
  }
}
