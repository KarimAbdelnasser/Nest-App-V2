import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from './task.schema';
import { UserModule } from 'src/users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { config } from 'src/config/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }]),
    JwtModule.register({
      secret: config.jwt,
    }),
    UserModule,
  ],
  exports: [TasksService],
  providers: [TasksService, JwtService],
  controllers: [TasksController],
})
export class TaskModule {}
