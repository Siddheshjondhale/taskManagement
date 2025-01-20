import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { ModalService } from '../shared/mock-test/mock-dialog';
import { SnackBarService } from '../shared/mock-test/mock-snackbar';
import { MockTasksService } from '../shared/mock-test/mock-tasks-service';
import { TasksService } from '../shared/services/task-manager/tasks.service';
import { TaskManagerComponent } from './task-manager.component';
import { tasks } from './tasks';

describe('TaskManagerComponent', () => {
  let component: TaskManagerComponent;
  let fixture: ComponentFixture<TaskManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskManagerComponent ],
      providers: [
        {
          provide: MatDialog,
          useValue: ModalService
        },
        {
          provide: MatSnackBar,
          useValue: SnackBarService
        },
        {
          provide:TasksService,
          useClass: MockTasksService
        }
      ],
      imports:[
        RouterModule.forRoot([])
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate table data', () => {
    component.populateTable();
    
    expect(component.dataSource.data.length).toBeGreaterThanOrEqual(tasks.length);
  });

  it('should create a new task data', () => {
    const task = {
      taskId: "6",
      taskName: "Learn C#",
      taskDescription: "Read C# Documentation",
      tag: [
      {
          tagId: "0",
          tagName: "Programming",
          taskId: "6"
      },
      {
          tagId: "1",
          tagName: "C#",
          taskId: "6"
      }
      ],
      dateCreated: new Date("2022-06-10T00:00:00"),
      dateModified: new Date("2022-06-13T00:00:00"),
      dateFinished: new Date("2022-06-13T00:00:00"),
      status: 2
  }
    component.addTaskService(task);

    expect(component.dataSource.data.length).toBeGreaterThan(tasks.length);
  });

  it('should update an existing data and match the new data', () => {
    const task = {
      taskId: "3",
      taskName: "Cook",
      taskDescription: "Cook something",
      tag: [
      {
          tagId: "0",
          tagName: "Programming",
          taskId: "3"
      },
      {
          tagId: "1",
          tagName: "C#",
          taskId: "3"
      }
      ],
      dateCreated: new Date("2022-06-10T00:00:00"),
      dateModified: new Date("2022-06-17T00:00:00"),
      dateFinished: new Date("2022-06-17T00:00:00"),
      status: 2
  }

  component.editTaskService(task);
  let index = component.dataSource.data.findIndex(t => t.taskId === task.taskId);
  expect(component.dataSource.data[index].taskName).toMatch(task.taskName);
  expect(component.dataSource.data[index].taskDescription).toMatch(task.taskDescription);
  expect(component.dataSource.data[index].tag.length).toEqual(task.tag.length);
  expect(component.dataSource.data[index].status).toEqual(task.status);
  expect(component.dataSource.data[index].dateModified).toEqual(task.dateModified);
  expect(component.dataSource.data[index].dateFinished).toEqual(task.dateFinished);
  });

  it('should delete a task', () => {
    const task = {
      taskId: "3",
    };

  component.deleteTaskService(task);

  expect(component.dataSource.data.length).toBeLessThan(tasks.length);
  });

  it('should search a task by name and description', () => {
    component.searchKey = "Learn";

    component.search();

    expect(component.dataSource.data.length).toBeGreaterThan(tasks.filter(t => t.taskName.includes(component.searchKey.toLowerCase())).length || tasks.filter(t => t.taskDescription.includes(component.searchKey.toLowerCase())).length);
  });
});
