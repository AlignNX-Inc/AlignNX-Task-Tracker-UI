import { Component, OnInit, signal, Input, Output, EventEmitter, inject, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ApiService } from '../../../services/api.service';
import { UserMeta } from '../../../models/task.model';

import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-user-info-item',
  templateUrl: './user-info-item.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./user-info-item.component.css'],
  imports: [FormsModule]
})
export class UserInfoItemComponent implements OnInit {

  @Input() user!: UserMeta;
  @Output() userUpdate = new EventEmitter<null>();

  apiService = inject(ApiService);

  beingEdited = signal<boolean>(false);

  updatedUsername = '';
  updatedName = '';
  updatedRole = '';

  constructor(private dialog: MatDialog) {}

  updateUser() {
    this.apiService.updateUser(this.user.id, this.updatedUsername, this.user.password_hash, this.updatedName, this.updatedRole).subscribe();
    this.beingEdited.set(false);
    this.userUpdate.emit();
  }

  deleteUser() {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {maxHeight: "fit-content"});

    dialogRef.afterClosed().subscribe(doDelete => {
      if (doDelete) {
        this.apiService.deleteUser(this.user.id).subscribe();
        this.beingEdited.set(false);
        this.userUpdate.emit();
      }
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user']) {
      this.updatedUsername = this.user.username;
      this.updatedName = this.user.name;
      this.updatedRole = this.user.role;
    }
  }

  ngOnInit() {

  }

}
