import { Component, inject } from '@angular/core';
import { user } from '../../../Models/user.model';
import { UserService } from '../../../Services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-list',
  imports: [CommonModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css',
})
export class UsersListComponent {
  users: user[] = [];
  userService = inject(UserService);

  constructor() {
    this.getUsers();
  }
  getUsers() {
    debugger;
    this.userService.getUser().subscribe((res: any) => {
      this.users = res;
    });
  }
}
