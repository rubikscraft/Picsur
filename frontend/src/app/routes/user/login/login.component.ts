import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { Permission, Permissions } from 'picsur-shared/dist/dto/permissions';
import { HasFailed } from 'picsur-shared/dist/types';
import { PermissionService } from 'src/app/api/permission.service';
import { UserService } from 'src/app/api/user.service';
import { SnackBarType } from 'src/app/models/snack-bar-type';
import { UtilService } from 'src/app/util/util.service';
import { LoginControl } from '../../../models/forms/login.model';
import { UserPassModel } from '../../../models/forms/userpass';

@Component({
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  private readonly logger = console;

  private permissions: Permissions = [];

  public get showRegister() {
    return this.permissions.includes(Permission.UserRegister);
  }

  model = new LoginControl();
  loginFail = false;

  constructor(
    private userService: UserService,
    private permissionService: PermissionService,
    private router: Router,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    const state = history.state as UserPassModel;
    if (state) {
      this.model.putData(state);
      history.replaceState(null, '');
    }

    this.onPermissions();
  }

  @AutoUnsubscribe()
  onPermissions() {
    return this.permissionService.live.subscribe((permissions) => {
      this.permissions = permissions;
    });
  }

  async onSubmit() {
    const data = this.model.getData();
    if (HasFailed(data)) {
      return;
    }

    const user = await this.userService.login(data.username, data.password);
    if (HasFailed(user)) {
      this.logger.warn(user);
      this.loginFail = true;
      return;
    }

    this.utilService.showSnackBar('Login successful', SnackBarType.Success);
    this.router.navigate(['/']);
  }

  async onRegister() {
    this.router.navigate(['/register'], {
      state: this.model.getRawData(),
    });
  }
}