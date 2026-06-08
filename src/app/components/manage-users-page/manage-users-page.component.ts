import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { TaskService } from '../../services/task.service';
import { FormsModule } from '@angular/forms';

import { UserMeta } from '../../models/task.model';
import { UserInfoItemComponent } from './user-info-item/user-info-item.component';

@Component({
  selector: 'app-manage-users-page',
  templateUrl: './manage-users-page.component.html',
  imports: [FormsModule, UserInfoItemComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./manage-users-page.component.css']
})
export class ManageUsersPageComponent  {

  apiService = inject(ApiService);
  taskService = inject(TaskService);
  users = signal<UserMeta[]>([]);

  message = signal<string>("User Management");

  get_users() {
    this.apiService.getUsers().subscribe({
      next: users => {
        this.users.set(users);
        this.users().map(u => {console.log(u)});
      },
      error: err => { 
        this.message.set("Failed to fetch user list!");
      }
    });
  }
}
