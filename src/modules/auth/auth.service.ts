import { User } from '@modules/users/esquemas';
import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from '../users';
import { CreateAuthDto } from './dto/create-auth.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly _user: UsersService) {}

  async register(signUp: SignUpDto): Promise<User> {
    const { name: firstName, ...res } = signUp;
    const result = await this._user.create({ firstName, ...res });
    let { password, ...user } = JSON.parse(JSON.stringify(result));

    return user;
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this._user.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // async validateUser(
  //   email: string,
  //   pass: string,
  // ): Promise<{ user: Partial<User>; message: HttpException }> {
  //   const user = await this._user.findOneByEmail(email);

  //   if (!user) {
  //     return {
  //       user: null,
  //       message: new HttpException('User not found', HttpStatus.UNAUTHORIZED),
  //     };
  //   }

  //   const areEqual = await compare(pass, user.password);

  //   if (!areEqual) {
  //     return {
  //       user: null,
  //       message: new HttpException(
  //         'Invalid credentials',
  //         HttpStatus.UNAUTHORIZED,
  //       ),
  //     };
  //   }

  //   const { password, ...result } = user;

  //   return { user: result, message: null };
  // }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
