import { TaskStatus } from "../task-status";

export interface Task {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    status: TaskStatus;
    createdAt: string;
    updatedAt: string;
}