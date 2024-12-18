import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterResponse, UserRegister } from 'src/model/user.model';
import { WebResponse } from 'src/model/web.model';

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}
  @Post()
  async register(
    @Body() request: UserRegister,
  ): Promise<WebResponse<RegisterResponse>> {
    const result = await this.userService.registerUser(request);
    return {
      data: result,
    };
  }
}
