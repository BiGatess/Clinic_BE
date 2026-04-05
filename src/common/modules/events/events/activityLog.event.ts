import { ActivityAction } from 'src/modules/activityLogs/interfaces/activityLog.interface';

export class ActivityLogEvent {
  // eslint-disable-next-line prettier/prettier
  constructor(public readonly userId: number, public readonly action: ActivityAction, public readonly targetId: number) {}
}
