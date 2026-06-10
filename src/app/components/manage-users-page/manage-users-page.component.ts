import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { TaskService } from '../../services/task.service';
import { FormsModule } from '@angular/forms';

import * as bcrypt from 'bcryptjs';

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
  showAddUser = signal<boolean>(false);
  password_message = signal<string>("");
  show_password = signal<boolean>(false);

  constructor() {
    this.get_users();
  }

  get_users() {
    this.apiService.getUsers().subscribe({
      next: users => {
        this.users.set(users);
        //this.users().map(u => {console.log(u)});
      },
      error: err => {
        this.message.set("Failed to fetch user list!");
      }
    });
  }



  newUserUsername = '';
  newUserName = '';
  newUserRole = '';
  newUserPassword = '';
  newUserPasswordConf = '';
  submitNewUser() {
    if (this.newUserUsername === '') {
      this.password_message.set("Please enter a username.");
      return;
    }
    if (!/^[a-zA-Z0-9]+$/.test(this.newUserUsername)) {
      this.password_message.set("Please enter a username.");
      return;
    }
    if (this.newUserPassword.length < 8) {
      this.password_message.set("Password must contain at least 8 characters.");
    }
    if ( ! ['!', '@', '#', '$', '&', '*', ';'].some(c => this.newUserPassword.includes(c))) {
      this.password_message.set("Password must contain one of the following special characters: ! @ # $ & * ;")
    }
    if (this.newUserPassword !== this.newUserPasswordConf)  {
      this.password_message.set("Passwords do not match!");
      return;
    }
    let password_hash = bcrypt.hashSync(this.newUserPassword, bcrypt.genSaltSync(10));
    this.apiService.addUser(this.newUserUsername, password_hash, this.newUserName, this.newUserRole).subscribe();
    this.showAddUser.set(false);
    this.password_message.set('');
    setTimeout(() => this.get_users(), 300);
  }
}
