import { Controller, Post, Body } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { SetMetadata } from '@nestjs/common';

// Helper function để NestJS biết bỏ qua Guard (thường nằm ở file utils)
// Tạm thời mình định nghĩa ở đây để bạn test
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
// ^ Hơi phức tạp, nhưng là cách tiêu chuẩn để bypass Guard.

@Controller('meeting')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Public() // 👈 THÊM DÒNG NÀY ĐỂ BỎ QUA KIỂM TRA ĐĂNG NHẬP
  @Post('create')
  async createMeeting(@Body() body: { patientName: string; startTime: string; endTime: string }) {
    const result = await this.meetingService.createGoogleMeet(body);
    return {
      success: true,
      data: result,
    };
  }
}