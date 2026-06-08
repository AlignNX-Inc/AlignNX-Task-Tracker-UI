import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TaskItemComponent } from '../task-item/task-item.component';
import { Goal, Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskItemComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent  {
  @Input() tasks!: Task[];
  @Output() toggleTask = new EventEmitter<{task_id: string, parent_id: string}>();
}
