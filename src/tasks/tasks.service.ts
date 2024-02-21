import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './task.schema';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dtos/create-task-dto';
import { UpdateTaskDto } from './dtos/update-task-dto';
import { logger } from 'src/utility/logger';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    try {
      const createdTask = new this.taskModel({
        ...createTaskDto,
        userId: userId,
      });

      return await createdTask.save();
    } catch (error) {
      logger.error(`Error creating a new task: ${(error as Error).message}`);

      throw new InternalServerErrorException(
        `Could not create task : ${error.message}`,
      );
    }
  }

  async getAllTasks(userId: string): Promise<Task[]> {
    const tasks = await this.taskModel
      .find({ userId })
      .select('-_id title description status')
      .exec();

    if (!tasks) {
      throw new NotFoundException('No tasks found for the user');
    }
    console.log(userId);
    console.log(tasks[0]);
    return tasks;
  }

  async getOne(userId: string, taskId: string): Promise<Task> {
    const task = await this.taskModel
      .findOne({ _id: taskId, userId })
      .select('-_id title description status')
      .exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async completedOne(userId: string, taskId: string): Promise<Task> {
    try {
      const task = await this.taskModel
        .findOne({ _id: taskId, userId })
        .select('title description status')
        .exec();

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      if (task.status === 'Completed') {
        throw new Error('This task is already completed');
      }

      task.status = 'Completed';

      await task.save();

      return task;
    } catch (error) {
      logger.error(`Error completing task: ${(error as Error).message}`);

      throw new InternalServerErrorException(
        `Could not completing task : ${error.message}`,
      );
    }
  }

  async update(
    id: string,
    userId: string,
    updatedTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.taskModel
      .findOneAndUpdate({ _id: id, userId }, updatedTaskDto, { new: true })
      .select('-_id title description status')
      .exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async delete(userId: string, taskId: string): Promise<Task> {
    const task = await this.taskModel
      .findOneAndDelete({ _id: taskId, userId })
      .exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async getAll() {
    try {
      const tasks = await this.taskModel
        .find()
        .select('-_id userId title description status')
        .exec();

      return tasks;
    } catch (error) {
      logger.error(`Error getting all tasks: ${(error as Error).message}`);

      throw new InternalServerErrorException(
        `Could not get all tasks : ${error.message}`,
      );
    }
  }

  async removeTask(id: string) {
    const task = await this.taskModel.findByIdAndDelete(id).exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }
}
