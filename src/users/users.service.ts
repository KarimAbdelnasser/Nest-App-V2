import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { UserDto } from './dtos/user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { logger } from 'src/utility/logger';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private authService: AuthService,
  ) {}

  async create(
    email: string,
    password: string,
  ): Promise<{ user: UserDto; token: string }> {
    const user = await this.userModel.find({ email });

    if (user.length) {
      throw new ConflictException('email in use!');
    }

    try {
      const hashedPassword = await this.authService.hashPassword(password);

      const newUser = await new this.userModel({
        email,
        password: hashedPassword,
      });

      await newUser.save();

      const token = await this.authService.generateJwtToken(
        newUser.id,
        newUser.isAdmin,
      );

      const userDto: UserDto = {
        id: newUser.id,
        email: newUser.email,
      };

      return { user: userDto, token };
    } catch (error) {
      logger.error(`Error creating a new user: ${(error as Error).message}`);

      throw new InternalServerErrorException(
        `Could not create user : ${error.message}`,
      );
    }
  }

  async findOne(id: number) {
    try {
      if (!id) {
        return null;
      }
      return this.userModel.findById(id);
    } catch (error) {
      logger.error(`Error find a user: ${(error as Error).message}`);

      throw new InternalServerErrorException(
        `Could not find : ${error.message}`,
      );
    }
  }

  async signin(
    email: string,
    password: string,
  ): Promise<{ user: UserDto; token: string }> {
    const [user] = await this.userModel.find({ email });

    if (!user) {
      throw new NotFoundException('The given email is not registered yet!');
    }

    await this.authService.comparePassword(password, user.password);

    try {
      const token = await this.authService.generateJwtToken(
        user.id,
        user.isAdmin,
      );

      const userDto: UserDto = {
        id: user.id,
        email: user.email,
      };

      return { user: userDto, token };
    } catch (error) {
      logger.error(`Error sign in: ${(error as Error).message}`);

      throw new InternalServerErrorException(
        `Could not sign in : ${error.message}`,
      );
    }
  }

  async update(id: number, attrs: Partial<UpdateUserDto>) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const disallowedFields = Object.keys(attrs).filter(
      (key) => !['fullName', 'email', 'password'].includes(key),
    );

    if (disallowedFields.length > 0) {
      throw new BadRequestException(
        `Cannot update fields: ${disallowedFields.join(', ')}`,
      );
    }

    if (attrs.password) {
      const isSamePassword = await this.authService.comparePassword(
        attrs.password,
        user.password,
      );
      if (isSamePassword === true) {
        throw new ConflictException(
          "The new password can't be the same as the old one!",
        );
      } else {
        attrs.password = await this.authService.hashPassword(attrs.password);
      }
    }
    try {
      Object.assign(user, attrs);

      const updatedUser = await user.save();

      return updatedUser;
    } catch (error) {
      logger.error(`Error update a user: ${(error as Error).message}`);

      throw new InternalServerErrorException(
        `Could not update : ${error.message}`,
      );
    }
  }

  async remove(id: number) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('User not found!');
    }
    try {
      await user.deleteOne({ id });

      return user;
    } catch (error) {
      logger.error(`Error delete a user: ${(error as Error).message}`);

      throw new InternalServerErrorException(
        `Could not remove : ${error.message}`,
      );
    }
  }

  async getAllUsers() {
    const users = await this.userModel.find().select('id name email').exec();
    return users;
  }

  async removeOne(id: string) {
    const pannedUser = await this.userModel.findByIdAndDelete(id);
    return pannedUser;
  }
  test(text: string) {
    return text;
  }
}
