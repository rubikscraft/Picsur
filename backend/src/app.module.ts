import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import cors from 'cors';
import { IncomingMessage, ServerResponse } from 'http';
import { EarlyConfigModule } from './config/early/early-config.module';
import { ServeStaticConfigService } from './config/early/serve-static.config.service';
import { TypeOrmConfigService } from './config/early/type-orm.config.service';
import { PicsurLoggerModule } from './logger/logger.module';
import { AuthManagerModule } from './managers/auth/auth.module';
import { DemoManagerModule } from './managers/demo/demo.module';
import { PicsurRoutesModule } from './routes/routes.module';

const mainCorsConfig = cors({
  origin: '<origin>',
});

const imageCorsConfig = cors({
  origin: '*',
  methods: ['GET', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: false,
  // A month
  maxAge: 30 * 24 * 60 * 60,
});

const imageCorpOverride = (
  req: IncomingMessage,
  res: ServerResponse,
  next: Function,
) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

  next();
};

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useExisting: TypeOrmConfigService,
      imports: [EarlyConfigModule],
    }),
    ServeStaticModule.forRootAsync({
      useExisting: ServeStaticConfigService,
      imports: [EarlyConfigModule],
    }),
    PicsurLoggerModule,
    AuthManagerModule,
    DemoManagerModule,
    PicsurRoutesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(mainCorsConfig).exclude('/i').forRoutes('/');
    consumer.apply(imageCorsConfig, imageCorpOverride).forRoutes('/i');
  }
}
