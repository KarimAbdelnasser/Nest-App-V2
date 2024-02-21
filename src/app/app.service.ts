import { Injectable } from '@nestjs/common';
import { TasksService } from 'src/tasks/tasks.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AppService {
  constructor(
    private tasksService: TasksService,
    private usersService: UsersService,
  ) {}
}
