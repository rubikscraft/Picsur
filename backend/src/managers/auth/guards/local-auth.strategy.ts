import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { EUser } from 'picsur-shared/dist/entities/user.entity';
import { AsyncFailable, HasFailed } from 'picsur-shared/dist/types';
import { UsersService } from '../../../collections/user-db/user-db.service';
import { EUserBackend2EUser } from '../../../models/transformers/user.transformer';

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  async validate(username: string, password: string): AsyncFailable<EUser> {
    // All this does is call the usersservice authenticate for authentication
    const user = await this.usersService.authenticate(username, password);
    if (HasFailed(user)) throw user;

    return EUserBackend2EUser(user);
  }
}
