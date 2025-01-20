import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TaskConfirmationDialogComponent } from './task-confirmation-dialog/task-confirmation-dialog.component';
import { TasksService } from '../shared/services/task-manager/tasks.service';
import { TaskModel } from '../shared/models/task-model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.scss']
})
export class TaskManagerComponent implements OnInit, AfterViewInit {

  // Column names for the task table
  displayedColumns: string[] = ['entityName', 'taskType', 'dateCreated', 'timeOfTask', 'contactPerson', 'note', 'status', 'actions'];
  dataSource = new MatTableDataSource<TaskModel>();
  assignedTasksCount: number = 0;
  newTasksCount: number = 0;
  newTasksCountPercentage: number = 0;
  inProgressTasksCount: number = 0;
  inProgressTasksCountPercentage: number = 0;
  completedTasksCount: number = 0;
  completedTasksCountPercentage: number = 0;
  searchKey: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  private searchSubject: Subject<string> = new Subject();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private taskService: TasksService,
    private cd: ChangeDetectorRef,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.populateTable();
  
      this.searchSubject.pipe(debounceTime(300)).subscribe(searchKey => {
            this.performSearch(searchKey);
        });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  // Fetch the tasks from the service
  populateTable(): void {
    this.taskService.getTableData().subscribe(data => {
      if (data) {
        this.dataSource.data = data;  // Set the table data
      }
    });
  }

    // Triggered on input event
    onSearchKeyChange(): void {
        this.searchSubject.next(this.searchKey.trim().toLowerCase());
    }

      private performSearch(searchKey: string): void {
        this.taskService.search(searchKey).subscribe(filteredData => {
            this.dataSource.data = filteredData;
            this.cd.detectChanges();
        });
    }

    sortByDate(): void {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        const sortedData = [...this.dataSource.data].sort((a, b) => {
            const dateA = new Date(a.timeOfTask).getTime();
            const dateB = new Date(b.timeOfTask).getTime();
            return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
        this.dataSource.data = sortedData;
    }
 
  
  // CRUD operations
  addTaskService(data: TaskModel) {
    this.taskService.addTask(data).subscribe(() => {
      this.populateTable();
      this.openSnackBar('Task added successfully', 'Close');
    });
  }

  editTaskService(data: TaskModel) {
    this.taskService.editTask(data, data.taskId!).subscribe(() => {
      this.populateTable();
      this.openSnackBar('Task updated successfully', 'Close');
    });
  }

  deleteTaskService(id: string) {
    this.taskService.deleteTask(id).subscribe(() => {
      this.populateTable();
      this.openSnackBar('Task deleted successfully', 'Close');
    });
  }

  openDialogConfirmation(id: string): void {
    this.taskService.getTableDataById(id).subscribe(res => {
      const dialog = this.dialog.open(TaskConfirmationDialogComponent, {
        width: '300px',
        data: {
          action: 'Delete',
          header: 'Delete',
          content: 'Are you sure you want to delete this task?',
          confirmButton: 'Yes',
          cancelButton: 'No',
          task: res
        }
      }).afterClosed().subscribe((data: any) => {
        if (data) {
          this.deleteTaskService(data.taskId);
        }
      });
    });
  }

  // Search functionality
  search() {
    this.searchKey = this.searchKey.trim().toLowerCase();
    this.taskService.search(this.searchKey).subscribe(filteredData => {
      this.dataSource.data = filteredData;
      this.cd.detectChanges();
    });
  }

  // Navigation methods
  onAdd() {
    this._router.navigate(['/task']);
  }

  onEdit(id: string) {
    this._router.navigate(['/task/' + id]);
  }

  // Open snack bar
  openSnackBar(message: string, action: string) {
    const snackBarOpt: MatSnackBarConfig = {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    };

    this._snackBar.open(message, action, snackBarOpt);
  }
}
