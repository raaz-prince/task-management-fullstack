import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { TaskRequest } from '../../models/task/task-request.model';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-task.html',
  styleUrl: './add-task.css',
})
export class AddTask {

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<TaskRequest>();

  formData: TaskRequest = {
    title: '',
    description: '',
    dueDate: ''
  };

  // Today's date in yyyy-mm-dd format (used for min attribute in date input)
  get todayISO(): string {
    const d = new Date();

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
  }

  closeModal(): void {
    this.close.emit();
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    console.log(this.formData);

    // Emit a copy (good practice — avoids reference mutation issues)
    this.save.emit({ ...this.formData });

    // Optional reset
    // this.formData = {
    //   title: '',
    //   description: '',
    //   dueDate: ''
    // };
  }
}