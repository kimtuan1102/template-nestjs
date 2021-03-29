import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FptIdAuthGuard } from '../../guards/auth.guard';
import { JwtPayload } from './interfaces/jwt.payload';
import { AuthUser } from '../../decorators/auth.user';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { RefreshAccessTokenDto } from './dto/refresh.access.token.dto';
import { UserLoginDto } from "./dto/user.login.dto";

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}
  //FPT ID Auth
  @Get('fpt-id/token')
  @UseGuards(FptIdAuthGuard)
  async getAccessToken(@AuthUser() jwtPayload: JwtPayload) {
    const user = await this.userService.createOrUpdateUserByEmail(
      jwtPayload.email,
      jwtPayload,
    );
    return {
      accessToken: await this.authService.createAccessToken(user),
      refreshToken: await this.authService.createRefreshToken(user._id),
    };
  }
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Login User' })
  @ApiOkResponse({})
  async login(@Body() userLoginDto: UserLoginDto) {
    return await this.authService.userLogin(userLoginDto);
  }

  //JWT Auth
  @Post('refresh-access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ description: 'Refresh Access Token with refresh token' })
  @ApiCreatedResponse({})
  async refreshAccessToken(
    @Body() refreshAccessTokenDto: RefreshAccessTokenDto,
  ) {
    return await this.authService.refreshAccessToken(refreshAccessTokenDto);
  }
}
