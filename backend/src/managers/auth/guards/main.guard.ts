import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { EUser, EUserSchema } from 'picsur-shared/dist/entities/user.entity';
import { Fail, Failable, FT, HasFailed } from 'picsur-shared/dist/types';
import { UsersService } from '../../../collections/user-db/user-db.service';
import { Permissions } from '../../../models/constants/permissions.const';
import { isPermissionsArray } from '../../../models/validators/permissions.validator';

// This guard extends both the jwt authenticator and the guest authenticator
// The order matters here, because this results in the guest authenticator being used as a fallback
// This way a user will get his own account when logged in, but received guest permissions when not

@Injectable()
export class MainAuthGuard extends AuthGuard(['jwt', 'guest']) {
  private readonly logger = new Logger('MainAuthGuard');

  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {
    super();
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    // Sanity check
    const result = await super.canActivate(context);
    if (result !== true) {
      throw Fail(
        FT.Internal,
        undefined,
        'Main Auth has denied access, this should not happen',
      );
    }

    const user = await this.validateUser(
      context.switchToHttp().getRequest().user,
    );
    if (!user.id) {
      throw Fail(
        FT.Internal,
        undefined,
        'User has no id, this should not happen',
      );
    }

    // These are the permissions required to access the route
    const permissions = this.extractPermissions(context);
    if (HasFailed(permissions)) {
      throw Fail(
        FT.Internal,
        undefined,
        'Fetching route permission failed: ' + permissions.getReason(),
      );
    }

    // These are the permissions the user has
    const userPermissions = await this.usersService.getPermissions(user.id);
    if (HasFailed(userPermissions)) {
      throw Fail(
        FT.Internal,
        undefined,
        'Fetching user permissions failed: ' + userPermissions.getReason(),
      );
    }

    context.switchToHttp().getRequest().userPermissions = userPermissions;

    if (permissions.every((permission) => userPermissions.includes(permission)))
      return true;
    else throw Fail(FT.Permission, 'Permission denied');
  }

  private extractPermissions(context: ExecutionContext): Failable<Permissions> {
    const handlerName = context.getHandler().name;
    // Fall back to class permissions if none on function
    // But function has higher priority than class
    const permissions =
      this.reflector.get<Permissions>('permissions', context.getHandler()) ??
      this.reflector.get<Permissions>('permissions', context.getClass());

    if (permissions === undefined)
      return Fail(
        FT.Internal,
        undefined,
        `${handlerName} does not have any permissions defined, denying access`,
      );

    if (!isPermissionsArray(permissions))
      return Fail(
        FT.Internal,
        undefined,
        `Permissions for ${handlerName} is not a string array`,
      );

    return permissions;
  }

  private async validateUser(user: EUser): Promise<EUser> {
    const result = EUserSchema.safeParse(user);
    if (!result.success) {
      throw Fail(
        FT.Internal,
        undefined,
        `Invalid user object, where it should always be valid: ${result.error}`,
      );
    }

    return result.data;
  }
}
