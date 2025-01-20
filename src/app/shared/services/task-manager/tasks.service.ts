import { Injectable } from '@angular/core';
import { TaskModel } from '../../models/task-model';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { formatDate } from '@angular/common';

const headerDict = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Headers': 'Content-Type',
  'X-Skip-Interceptor': 'X-Skip-Interceptor'
};

const requestOptions = {
  headers: new HttpHeaders(headerDict),
};

const TASKS_API_URL = "https://taskmanagerbackend-4vbj.onrender.com/tasks";

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  
  constructor(private http: HttpClient) { }

  // Get all tasks
  getTableData(): Observable<TaskModel[]> {
    return this.http.get<TaskModel[]>(this.getEndpoint('GET'), requestOptions);
  }

  // Get task by ID
  getTableDataById(id: string): Observable<TaskModel> {
    console.log(TASKS_API_URL+" "+id)
    return this.http.get<TaskModel>(this.getEndpoint('GET_BY_ID', id), requestOptions);
  }
  
  // Add a new task
  addTask(data: TaskModel): Observable<TaskModel> {
    if (!data.dateCreated) {
      data.dateCreated = new Date(); // Set the current date if not provided
    }
    return this.http.post<TaskModel>(this.getEndpoint('POST'), data, requestOptions);
  }


  // Edit an existing task
  editTask(data: TaskModel, id: string): Observable<TaskModel> {
  if (data.timeOfTask) {
    data.timeOfTask = new Date(data.timeOfTask);  // or format accordingly
  }
  console.log("task id on edit"+data.taskId)

  return this.http.put<TaskModel>(this.getEndpoint('PUT', id), data, requestOptions);
}


  // Delete a task
  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(this.getEndpoint('DELETE', id), requestOptions);
  }


search(searchKey: string): Observable<TaskModel[]> {
    if (!searchKey) {
        return this.getTableData();
    }

    return this.http.get<TaskModel[]>(TASKS_API_URL).pipe(
        map(tasks => tasks.filter(task => {
            const formattedDate = formatDate(task.timeOfTask, 'dd/MM/yyyy', 'en-US');
            return (
                task.entityName.toLowerCase().includes(searchKey) ||
                task.taskType.toLowerCase().includes(searchKey) ||
                (task.contactPerson && task.contactPerson.toLowerCase().includes(searchKey)) ||
                (task.note && task.note.toLowerCase().includes(searchKey)) ||
                (task.status && task.status.toLowerCase().includes(searchKey)) ||
                formattedDate.includes(searchKey) // Match formatted date
            );
        }))
    );
}


  // Helper function to build API endpoint URLs
  private getEndpoint(keyword: string, param?: string): string {
    switch (keyword) {
      case 'GET':
      case 'POST':
        return `${TASKS_API_URL}`;
      case 'GET_BY_ID':
      case 'PUT':
      case 'DELETE':
        return `${TASKS_API_URL}/${param}`;
      default:
        return "";
    }
  }
}
