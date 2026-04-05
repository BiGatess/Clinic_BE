import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { google } from 'googleapis';
import { GoogleAuth } from "google-auth-library";
@Injectable()
export class MeetingService {
  private readonly logger = new Logger(MeetingService.name);
  private calendar;

  constructor() {
    this.initGoogleCalendar();
  }

  private initGoogleCalendar() {
    try {
      const KEY_FILE_PATH = path.join(process.cwd(), 'service-account.json');

      const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: ['https://www.googleapis.com/auth/calendar']
      });

      this.calendar = google.calendar({ version: 'v3', auth });
      this.logger.log('✅ MeetingService: Kết nối Google Calendar thành công (Sẵn sàng phục vụ).');
    } catch (error) {
      this.logger.error('❌ MeetingService: Lỗi kết nối Google (Kiểm tra file json): ' + error.message);
    }
  }

  async createGoogleMeet(bookingData: { patientName: string; startTime: string; endTime: string }) {
    if (!this.calendar) {
      this.logger.warn('⚠️ Google Calendar chưa được khởi tạo. Bỏ qua bước tạo Meet.');
      return null;
    }

    try {
      this.logger.log(`🔄 Đang xử lý tạo lịch cho bệnh nhân: ${bookingData.patientName}`);

      const startDateTime = bookingData.startTime.split('+')[0];
      const endDateTime = bookingData.endTime.split('+')[0];

      const eventBody = {
        summary: `Khám bệnh: ${bookingData.patientName}`,
        description: `Lịch khám Online.\nĐược tạo tự động bởi hệ thống Clinic Care.\nMã cuộc hẹn: ${uuidv4()}`,
        start: {
          dateTime: startDateTime,
          timeZone: 'Asia/Ho_Chi_Minh'
        },
        end: {
          dateTime: endDateTime,
          timeZone: 'Asia/Ho_Chi_Minh'
        },
        conferenceData: {
          createRequest: {
            requestId: uuidv4(),
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        }
      };

      try {
        const response = await this.calendar.events.insert({
          calendarId: 'thachhbaoloc@gmail.com',
          resource: eventBody,
          conferenceDataVersion: 1
        });

        const meetLink = response.data.hangoutLink;

        if (meetLink) {
          this.logger.log(`✅ Tạo thành công Link Meet xịn: ${meetLink}`);
          return { meetLink: meetLink, eventId: response.data.id };
        } else {
          throw new Error('Google không trả về link Meet.');
        }
      } catch (apiError) {
        this.logger.warn(`⚠️ Không thể tạo link Meet tự động (Lỗi: ${apiError.code || apiError.message}). Đang chuyển sang chế độ dự phòng...`);

        delete eventBody.conferenceData;

        const backupLink = 'https://meet.google.com/new';
        eventBody.description += `\n\n⚠️ Lưu ý: Hệ thống không thể tạo link tự động. Vui lòng sử dụng link dự phòng hoặc bác sĩ sẽ gửi link sau.\nLink dự phòng: ${backupLink}`;

        const fallbackResponse = await this.calendar.events.insert({
          calendarId: 'thachhbaoloc@gmail.com',
          resource: eventBody
        });

        this.logger.log(`✅ Đã tạo lịch thường thành công (ID: ${fallbackResponse.data.id}). Sử dụng link dự phòng.`);

        return {
          meetLink: backupLink,
          eventId: fallbackResponse.data.id
        };
      }
    } catch (criticalError) {
      this.logger.error('❌ Lỗi nghiêm trọng trong MeetingService:', criticalError.message);
      return null;
    }
  }
}
