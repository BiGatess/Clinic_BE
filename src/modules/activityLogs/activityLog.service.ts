import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base/baseService';
import { ActivityLog } from './entities/activityLog.entity';

@Injectable()
export class ActivityLogService extends BaseService<ActivityLog> {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepo: Repository<ActivityLog>
  ) {
    super(activityLogRepo);
  }
}
