import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { RegisterResponse, UserRegister } from 'src/model/user.model';
import { Logger } from 'winston';
import { UserValidatiton } from './user.validate';
import * as Bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}
  async registerUser(request: UserRegister): Promise<RegisterResponse> {
    this.logger.debug(`Register New User ${JSON.stringify(request)}`);
    const registerRequest: UserRegister = this.validationService.validate(
      UserValidatiton.Register,
      request,
    );
    const totalUserWithUsername = await this.prismaService.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (totalUserWithUsername != 0) {
      throw new HttpException('Username already exist', 400);
    }

    registerRequest.password = await Bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: registerRequest,
    });
    return {
      username: user.username,
      name: user.name,
    };
  }
}
