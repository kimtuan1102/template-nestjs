import { AuthGuard } from '@nestjs/passport';

//Sử dụng cho luồng login bằng FPTID (Front end)
export const FptIdAuthGuard = AuthGuard('fpt-id');

export const JWTAuthGuard = AuthGuard('jwt');
