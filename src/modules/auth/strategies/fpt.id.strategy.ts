import { PassportStrategy } from '@nestjs/passport';
import { HttpService, Injectable } from '@nestjs/common';
import { Strategy } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FptIdStrategy extends PassportStrategy(Strategy, 'fpt-id') {
  constructor(private http: HttpService, private configService: ConfigService) {
    super({
      authorizationURL: `${configService.get('FPT_ID_ENDPOINT')}/authorize`,
      tokenURL: `${configService.get('FPT_ID_ENDPOINT')}/token/`,
      scope: 'openid email profile phone',
      clientID: configService.get('FPT_ID_CLIENT_ID'),
      clientSecret: configService.get('FPT_ID_CLIENT_SECRET'),
    });
  }
  async validate(accessToken: string): Promise<any> {
    const { data } = await this.http
      .get(
        `${this.configService.get(
          'FPT_ID_ENDPOINT',
        )}/userinfo/?access_token=${accessToken}`,
      )
      .toPromise();
    return data;
  }
}
