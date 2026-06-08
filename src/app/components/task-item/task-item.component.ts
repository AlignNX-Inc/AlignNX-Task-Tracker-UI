import { Component, Input, Output, EventEmitter, OnInit, signal, inject } from '@angular/core';
import { TaskService } from '../../services/task.service';

import { Task } from '../../models/task.model';

interface TaskInfo {
  task_id: string,
  parent_id: string
}

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css'],
})
export class TaskItemComponent implements OnInit {
  @Input() task!: Task;
  @Output() toggle = new EventEmitter<TaskInfo>();

  taskService = inject(TaskService);

  emitData() {
    this.toggle.emit({task_id: this.task.id, parent_id: this.task.parent.id})
  }

  deleteTask() {
    this.taskService.deleteTask(this.task.parent.id, this.task.id)
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