import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import Config from '../../../env';
import { JwtDataDto } from 'picsur-shared/dist/dto/auth.dto';
import { EUserBackend } from '../../../models/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger('JwtStrategy');

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Config.jwt.secret,
    });
  }

  async validate(payload: any): Promise<EUserBackend> {
    const jwt = plainToClass(JwtDataDto, payload);

    const errors = await validate(jwt, {
      forbidUnknownValues: true,
    });

    if (errors.length > 0) {
      this.logger.warn(errors);
      throw new UnauthorizedException();
    }

    return jwt.user;
  }
}
