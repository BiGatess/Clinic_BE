import { Injectable } from '@nestjs/common';
import { ZegoToken } from './zego-token'; // Import file vừa tạo

@Injectable()
export class VideoCallService {
  private readonly appID = 139922688;
  
  // ⚠️ QUAN TRỌNG: Bạn hãy kiểm tra kỹ lại Secret này trong Dashboard Zego Cloud
  // Nếu Secret sai thì Token sinh ra sẽ vô dụng (Lỗi 1102016)
  private readonly serverSecret = 'e0855d8663fc3a42aa49489d905b8be5';

  generateToken(userId: string, roomId: string): string {
    const effectiveTimeInSeconds = 3600; 
    
    const payload = {
      room_id: roomId,
      privilege: {
        1: 1, // Login
        2: 1, // Publish
      },
      stream_id_list: null,
    };

    // Gọi hàm tạo token chuẩn từ file zego-token.ts
    const token = ZegoToken.generate(
      this.appID,
      userId,
      this.serverSecret,
      effectiveTimeInSeconds,
      JSON.stringify(payload),
    );

    return token;
  }
}