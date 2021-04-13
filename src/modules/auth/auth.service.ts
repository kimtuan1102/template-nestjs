import {
  BadRequestException,
  HttpService,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt.payload';
import { User } from '../user/user.interface';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshToken } from './interfaces/refresh.token';
import { Model } from 'mongoose';
import { UtilsService } from '../../providers/utils.service';
import { UserService } from '../user/user.service';
import { RefreshAccessTokenDto } from './dto/refresh.access.token.dto';
import { UserLoginDto } from './dto/user.login.dto';
import { AuthorizationTokenRequest } from './interfaces/authorization.token.request';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel('RefreshToken')
    private readonly refreshTokenModel: Model<RefreshToken>,
    private readonly userService: UserService,
    private http: HttpService,
    private configService: ConfigService,
  ) {}
  createAccessToken(user: User): string {
    const jwtPayload = this.buildJwtPayload(user);
    return this.jwtService.sign(jwtPayload);
  }
  async userLogin(userLoginDto: UserLoginDto) {
    const user = await this.validateLoginUser(userLoginDto);
    return {
      accessToken: await this.createAccessToken(user),
    };
  }
  async createRefreshToken(userId: string): Promise<string> {
    const refreshToken = new this.refreshTokenModel({
      userId,
      refreshToken: UtilsService.generateRandomString(60),
    });
    await refreshToken.save();
    return refreshToken.refreshToken;
  }
  async refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto) {
    const userId = await this.findRefreshToken(
      refreshAccessTokenDto.refreshToken,
    );
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new BadRequestException('Bad request');
    }
    return {
      accessToken: await this.createAccessToken(user),
    };
  }
  async validateJwtUser(jwtPayload: JwtPayload): Promise<User> {
    try {
      return await this.userService.findUserById(jwtPayload.sub);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
  async validateLoginUser(userLoginDto: UserLoginDto): Promise<User> {
    const user = await this.userService.findUserByEmail(userLoginDto.email);
    const isPasswordValid = await UtilsService.validateHash(
      userLoginDto.password,
      user && user.password,
    );
    if (!user || !isPasswordValid) {
      throw new UnauthorizedException();
    }
    return user;
  }
  async getUserInfoFptId(requestToken: AuthorizationTokenRequest) {
    const body = Object.keys(requestToken)
      .map(function (k) {
        return (
          encodeURIComponent(k) + '=' + encodeURIComponent(requestToken[k])
        );
      })
      .join('&');
    const tokenResponse = await this.http
      .post(`${this.configService.get('FPT_ID_ENDPOINT')}/token`, body, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .toPromise();
    const { data } = await this.http
      .get(
        `${this.configService.get('FPT_ID_ENDPOINT')}/userinfo/?access_token=${
          tokenResponse.data.access_token
        }`,
      )
      .toPromise();
    return data;
  }

  // ***************************************************************************
  //                                 PRIVATE METHOD
  // ***************************************************************************
  private async findRefreshToken(token: string) {
    const refreshToken = await this.refreshTokenModel.findOne({
      refreshToken: token,
    });
    if (!refreshToken) {
      throw new UnauthorizedException('User has been logged out.');
    }
    return refreshToken.userId;
  }
  private buildJwtPayload(user: User): JwtPayload {
    return {
      sub: user._id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
    };
  }
}
