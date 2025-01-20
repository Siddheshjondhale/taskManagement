export interface TaskModel {
  taskId?: string;         // Task ID, optional
  entityName: string;      // Customer or entity name
  taskType: string;        // Type of task (e.g., "Installation", "Support")
  dateCreated: Date;       // Task creation date
  timeOfTask: Date;        // The expected time for the task to be done
  contactPerson: string;   // Name of the person assigned to the task
  note?: string;           // Optional note associated with the task
  status: 'open' | 'closed';  // Task status, default is 'open'
}