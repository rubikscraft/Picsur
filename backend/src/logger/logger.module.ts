import { Module } from '@nestjs/common';
import { EarlyConfigModule } from '../config/early/early-config.module';
import { PicsurLoggerService } from './logger.service';

@Module({
  imports: [EarlyConfigModule],
  providers: [PicsurLoggerService],
  exports: [PicsurLoggerService],
})
export class PicsurLoggerModule {}
