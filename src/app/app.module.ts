import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModule } from 'src/users/users.module';
import { TaskModule } from 'src/tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'src/config/config';
import { logger } from 'src/utility/logger';
import { MorganMiddleware } from 'src/middleware/morgan.middleware';
import { JwtMiddleware } from 'src/middleware/jwt.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: () => ({ uri: config.mongoUrlPro }),
    }),
    UserModule,
    TaskModule,
  ],
  providers: [AppService, { provide: 'Logger', useValue: logger }],
  exports: ['Logger'],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        { path: 'user/signup', method: RequestMethod.POST },
        { path: 'user/signin', method: RequestMethod.POST },
      )
      .forRoutes('*');
    consumer.apply(MorganMiddleware).forRoutes('*');
  }
}
