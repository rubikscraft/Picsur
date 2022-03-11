import { Injectable } from '@nestjs/common';
import { Roles } from 'picsur-shared/dist/dto/roles.dto';
import { EUserBackend } from '../../models/entities/user.entity';

@Injectable()
export class GuestService {
  public createGuest(): EUserBackend {
    const guest = new EUserBackend();
    guest.id = -1;
    guest.roles = this.createGuestRoles();
    guest.username = 'guest';

    return guest;
  }

  private createGuestRoles(): Roles {
    return [];
  }
}