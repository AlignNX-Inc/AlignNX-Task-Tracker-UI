import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Goal, Task, UserAuth, UserMeta } from '../models/task.model';

// Change this to match your backend URL
const API_BASE = '/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  checkUsername(username: string, password: string): Observable<UserAuth> {
    return this.http.post<UserAuth>(`${API_BASE}/login`, {username: username, password: password})
  }

  getSession(): Observable<UserAuth> {
    return this.http.get<UserAuth>(`${API_BASE}/session`);
  }

  endSession(): Observable<void> {
    return this.http.post<void>(`${API_BASE}/logout`, {});
  }

  getUpdated(): Observable<string> {
    return this.http.get<string>(`${API_BASE}/updated`);
  }

  getGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${API_BASE}/goals`);
  }

  toggleTask(goalId: string, taskId: string, completed: boolean): Observable<Task> {
    return this.http.patch<Task>(`${API_BASE}/goals/${goalId}/tasks/${taskId}`, { completed });
  }

  createGoal(title: string): Observable<Goal> {
    return this.http.post<Goal>(`${API_BASE}/goals`, { title });
  }

  createTask(goalId: string, title: string, assignedTo: string, completeBy: string): Observable<Task> {
    return this.http.post<Task>(`${API_BASE}/goals/${goalId}/tasks`, { title, assignedTo, completeBy });
  }

  deleteTask(goalId: string, taskId: string): Observable<string> {
    return this.http.delete<string>(`${API_BASE}/goals/${goalId}/tasks/${taskId}`)
  }

  getUsers(): Observable<UserMeta[]> {
    return this.http.get<UserMeta[]>(`${API_BASE}/users`);
  }
}