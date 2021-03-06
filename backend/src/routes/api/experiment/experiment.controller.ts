import { Controller, Get, Request } from '@nestjs/common';
import { UserInfoResponse } from 'picsur-shared/dist/dto/api/user-manage.dto';
import { Permission } from 'picsur-shared/dist/dto/permissions.enum';
import { Fail, FT } from 'picsur-shared/dist/types';
import { NoPermissions, RequiredPermissions } from '../../../decorators/permissions.decorator';
import { ReqUserID } from '../../../decorators/request-user.decorator';
import { Returns } from '../../../decorators/returns.decorator';
import type AuthFasityRequest from '../../../models/interfaces/authrequest.dto';

@Controller('api/experiment')
@NoPermissions()
@RequiredPermissions(Permission.Settings)
export class ExperimentController {
  @Get()
  @Returns(UserInfoResponse)
  async testRoute(
    @Request() req: AuthFasityRequest,
    @ReqUserID() thing: string,
  ): Promise<UserInfoResponse> {
    throw Fail(FT.NotFound, new Error("hello"));
    return req.user;
  }
}
