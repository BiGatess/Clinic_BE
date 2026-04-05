import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from 'src/common/middlewares/middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLog } from './entities/activityLog.entity';
import { ActivityLogService } from './activityLog.service';
import { ActivityLogController } from './activityLog.controller';
import { ActivityLogListener } from './listeners/activityLog.listener';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLog])],
  controllers: [ActivityLogController],
  providers: [ActivityLogService, ActivityLogListener],
  exports: [ActivityLogService, ActivityLogListener]
})
export class ActivityLogModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(ActivityLogController);
  }
}
