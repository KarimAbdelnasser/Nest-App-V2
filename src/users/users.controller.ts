import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user-dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AdminAuthGuard } from 'src/guards/admin.guard';
import { SkipAdmin } from 'src/decorators/skip-admin-guard.decorator';

@Controller('user')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  @SkipAdmin()
  async createUser(@Body() body: CreateUserDto, @Res() res) {
    const { user, token } = await this.usersService.create(
      body.email,
      body.password,
    );

    res.header('auth-token', token).json({
      message: `User created successfully with ID "${user.id}" and email "${user.email}"`,
    });
  }

  @Post('/signin')
  @SkipAdmin()
  async signin(@Body() body: CreateUserDto, @Res() res) {
    const { user, token } = await this.usersService.signin(
      body.email,
      body.password,
    );

    res.header('auth-token', token).json({
      message: `${user.id} You have signed in successfully.`,
    });
  }

  @Patch('/update')
  @SkipAdmin()
  async updateUser(@Req() req, @Body() body: UpdateUserDto, @Res() res) {
    if (!req.user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const userId = req.user._id;

    await this.usersService.update(userId, body);

    return res.json({
      message: `Your data updated successfully`,
    });
  }

  @Delete('/unsubscribe')
  @SkipAdmin()
  async removeUser(@Req() req, @Res() res) {
    if (!req.user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const userId = req.user._id;

    const deletedUser = await this.usersService.remove(userId);

    res.json({
      message: `${deletedUser.fullName || deletedUser.email} We're sad to see you go! Your account has been deleted successfully`,
    });
  }

  @Get('/getAll')
  @UseGuards(AdminAuthGuard)
  async getAllUsers(@Res() res) {
    const allUsers = await this.usersService.getAllUsers();

    return res.json({
      message: 'Successfully fetched all users',
      data: allUsers,
    });
  }

  @Delete('/remove/:id')
  @UseGuards(AdminAuthGuard)
  async removeOne(@Param('id') id: string, @Res() res) {
    const pannedUser = await this.usersService.removeOne(id);
    return res.json({
      ' message': `User ${pannedUser.fullName || pannedUser.email} removed successfully`,
    });
  }
}
