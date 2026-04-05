import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ActivityLogService } from '../activityLog.service';
import { ActivityTargetType } from '../interfaces/activityLog.interface';
import { ActivityLogEvent } from 'src/common/modules/events/events/activityLog.event';

@Injectable()
export class ActivityLogListener {
  private readonly logger = new Logger(ActivityLogListener.name);

  constructor(private readonly activityLogService: ActivityLogService) {}

  @OnEvent('activity.project', { async: true })
  handleActivityProjectEvent(payload: ActivityLogEvent) {
    this.logger.log('Handling activity project event');
    this.activityLogService.create({
      ...payload,
      targetType: ActivityTargetType.PROJECT
    });
  }
  @OnEvent('activity.task', { async: true })
  handleActivityTaskEvent(payload: ActivityLogEvent) {
    this.logger.log('Handling activity task event');
    this.activityLogService.create({
      ...payload,
      targetType: ActivityTargetType.TASK
    });
  }

  @OnEvent('activity.attachment', { async: true })
  handleActivityAttachment(payload: ActivityLogEvent) {
    this.logger.log('Handling activity attachment event');
    this.activityLogService.create({
      ...payload,
      targetType: ActivityTargetType.ATTACHMENT
    });
  }

  @OnEvent('activity.risk', { async: true })
  handleActivityRisk(payload: ActivityLogEvent) {
    this.logger.log('Handling activity risk event');
    this.activityLogService.create({
      ...payload,
      targetType: ActivityTargetType.RISK
    });
  }
  @OnEvent('activity.issue', { async: true })
  handleActivityIssue(payload: ActivityLogEvent) {
    this.logger.log('Handling activity issue event');
    this.activityLogService.create({
      ...payload,
      targetType: ActivityTargetType.ISSUE
    });
  }
}
