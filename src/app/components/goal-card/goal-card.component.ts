import { Component, Input, Output, EventEmitter, inject, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { TaskService } from '../../services/task.service';

import { FormsModule } from '@angular/forms';
import { Goal } from '../../models/task.model';
import { TaskItemComponent } from '../task-item/task-item.component';

import { ConfirmDeleteDialogComponent } from '../../dialogues/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-goal-card',
  standalone: true,
  imports: [FormsModule, TaskItemComponent],
  templateUrl: `./goal-card.component.html`,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './goal-card.component.css',
})
export class GoalCardComponent {
  @Input() goal!: Goal;
  @Input() progress!: number;
  @Input() isComplete!: boolean;
  @Output() toggleExpanded = new EventEmitter<void>();
  @Output() toggleTask = new EventEmitter<{task_id: string, parent_id: string}>();
  @Output() addTask = new EventEmitter<{ title: string; assignedTo: string, completeBy: string }>();

  taskService = inject(TaskService);

  showAddTask = signal(false);
  invalidDateEntered = signal(false);
  newTaskTitle = '';
  newTaskAssignee = '';
  newTaskCompleteBy = '';

  constructor (private dialog: MatDialog) {
    effect(() => {
      if (this.showAddTask()) {
        this.taskService.prevent_reload.set(true);
      }
      else {
        this.taskService.prevent_reload.set(false);
      }
    })
  }

  submitTask(): void {
    const title = this.newTaskTitle.trim();
    const assignedTo = this.newTaskAssignee.trim() || 'Unassigned';
    let completeBy = this.newTaskCompleteBy.trim();

    const mmddyyyy_Regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    const mmdd_Regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/;

    if (mmdd_Regex.test(completeBy) && !mmddyyyy_Regex.test(completeBy)) {
      completeBy = completeBy.concat("/" + String( new Date().getFullYear() ));
    }

    if (!title) return;
    if (!mmddyyyy_Regex.test(completeBy) && completeBy !== "") {
      this.invalidDateEntered.set(true);
      return;
    }
    if (isNaN(new Date(completeBy).getDate()) && completeBy !== "") {
      this.invalidDateEntered.set(true);
      return;
    }
    this.invalidDateEntered.set(false);

    this.addTask.emit({ title, assignedTo, completeBy });
    this.newTaskTitle = '';
    this.newTaskAssignee = '';
    this.newTaskCompleteBy = '';
    this.showAddTask.set(false);
  }

  deleteGoal(): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {maxHeight: "fit-content"});

    dialogRef.afterClosed().subscribe(doDelete => {
      if (doDelete) {
        this.taskService.deleteGoal(this.goal.id);
      }
    });
  }
}
