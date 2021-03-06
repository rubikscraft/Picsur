import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvPrefix } from '../config.static';

@Injectable()
export class EarlyJwtConfigService {
  constructor(private readonly configService: ConfigService) {}

  public getJwtSecret(): string | undefined {
    return this.configService.get<string>(`${EnvPrefix}JWT_SECRET`);
  }

  public getJwtExpiresIn(): string | undefined {
    return this.configService.get<string>(`${EnvPrefix}JWT_EXPIRY`);
  }
}
