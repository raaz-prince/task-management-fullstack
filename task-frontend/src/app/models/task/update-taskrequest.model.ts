import { Task } from "./task-response.model";

export type UpdateTaskRequest = Pick<Task, 'title' | 'description' | 'dueDate'>;