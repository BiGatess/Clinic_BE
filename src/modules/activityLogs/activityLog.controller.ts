import { Controller } from '@nestjs/common';
import { ActivityLogService } from './activityLog.service';
import { BaseController } from 'src/base/baseController';
import { ApiTags } from '@nestjs/swagger';

@Controller('activities')
@ApiTags('Activities')
export class ActivityLogController extends BaseController {
  constructor(private readonly activityLogService: ActivityLogService) {
    super();
  }
}
