import { Component, Input, Output, EventEmitter, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';

import { Task } from '../../models/task.model';

interface TaskInfo {
  task_id: string,
  parent_id: string
}

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-item.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./task-item.component.css'],
})
export class TaskItemComponent implements OnInit {
  @Input() task!: Task;
  @Output() toggle = new EventEmitter<TaskInfo>();

  taskService = inject(TaskService);

  isEditing = false;
  editTitle = '';
  editDate = '';
  editAssignee = '';

  emitData() {
    this.toggle.emit({task_id: this.task.id, parent_id: this.task.parent.id})
  }

  deleteTask() {
    this.taskService.deleteTask(this.task.parent.id, this.task.id)
  }

  startEdit() {
    this.editTitle = this.task.title;
    this.editDate = this.task.completionDate ?? '';
    this.editAssignee = this.task.assignedTo;
    this.isEditing = true;
    this.taskService.prevent_reload.set(true);
  }

  saveEdit() {
    if (this.editTitle.trim()) {
        this.task = {
            ...this.task,
            title: this.editTitle.trim(),
            assignedTo: this.editAssignee.trim(),
            completionDate: this.editDate.trim(),
        };
        this.taskService.updateTask(
            this.task.parent.id,
            this.task.id,
            this.editTitle.trim(),
            this.editAssignee.trim(),
            this.editDate.trim(),
            this.task.completed
        );
    }
    this.isEditing = false;
    this.taskService.prevent_reload.set(false);
  }

  background_color = signal<string>("");
  text_color = signal<string>("");

  ngOnInit() {
    const day_diff = Math.floor(((new Date(this.task.completionDate)).getTime() - (new Date()).getTime()) / (1000 * 60 * 60 * 24)) + 1;

    if (this.task.completed) {
      this.text_color.set("var(--text-muted)")
      this.background_color.set("var(--surface)")
    }

    else {
      this.text_color.set("#222222");
      this.background_color.set(  
        (day_diff > 7) ? "#b2fdb2" :
        (day_diff > 5) ? "#ffffb3" :
        (day_diff > 3) ? "#ffdba0" :
        (day_diff > 0) ? "#ff9e86" :
        (day_diff > -1)? "#ff8383" :
        (day_diff < 0) ? "#ff7070" : "#ff4848");
    }
  }
}