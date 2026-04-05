import { Controller, Get, Query } from '@nestjs/common';
import { VideoCallService } from './video-call.service';

@Controller('video-call')
export class VideoCallController {
  constructor(private readonly videoCallService: VideoCallService) {}

  @Get('token')
  getToken(
    @Query('userId') userId: string,
    @Query('roomId') roomId: string,
  ) {
    if (!userId || !roomId) {
      return { error: 'Missing userId or roomId' };
    }

    const token = this.videoCallService.generateToken(userId, roomId);
    return { token };
  }
}