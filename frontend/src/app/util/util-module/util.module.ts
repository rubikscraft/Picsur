import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS
} from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { ApiErrorService } from './api-error.service';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { DownloadDialogComponent } from './download-dialog/download-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressBarModule,
    RouterModule,
  ],
  declarations: [ConfirmDialogComponent, DownloadDialogComponent],
})
export class UtilModule {
  static forRoot(): ModuleWithProviders<UtilModule> {
    return {
      ngModule: UtilModule,
      providers: [
        {
          provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
          useValue: {
            duration: 4000,
            horizontalPosition: 'left',
          },
        },
      ],
    };
  }

  // Start apiErrorService, the nothing function does nothing, but it silents the error.
  constructor(apiErrorService: ApiErrorService) {
    apiErrorService.nothing();
  }
}
