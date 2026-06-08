import { Component, OnInit, signal, Input, inject } from '@angular/core';

import { ApiService } from '../../../services/api.service';
import { UserMeta } from '../../../models/task.model';

@Component({
  selector: 'app-user-info-item',
  templateUrl: './user-info-item.component.html',
  styleUrls: ['./user-info-item.component.css']
})
export class UserInfoItemComponent implements OnInit {

  @Input() user!: UserMeta;

  apiService = inject(ApiService);

  ngOnInit() {

  }

}
