import * as crypto from 'crypto';

export class ZegoToken {
  static generate(
    appId: number,
    userId: string,
    secret: string,
    effectiveTimeInSeconds: number,
    payload: string,
  ): string {
    const createTime = Math.floor(new Date().getTime() / 1000);
    const tokenInfo = {
      app_id: appId,
      user_id: userId,
      nonce: Math.floor(Math.random() * 2147483647),
      ctime: createTime,
      expire: createTime + effectiveTimeInSeconds,
      payload: payload,
    };

    const tokenInfoStr = JSON.stringify(tokenInfo);

    // 1. Tạo IV ngẫu nhiên 16 bytes
    const iv = crypto.randomBytes(16);

    // 2. Xử lý Secret: Nếu secret là 32 ký tự, nó là Hex -> Chuyển sang Buffer 16 bytes
    let key: Buffer;
    if (secret.length === 32) {
        key = Buffer.from(secret, 'hex');
    } else {
        // Fallback nếu secret có độ dài khác (hiếm gặp)
        key = Buffer.from(secret.substring(0, 16), 'utf8');
    }

    // 3. Mã hóa AES-128-CBC
    const encryptor = crypto.createCipheriv('aes-128-cbc', key as any, iv as any);
    
    let encrypted: any = encryptor.update(tokenInfoStr, 'utf8');
    encrypted = Buffer.concat([encrypted, encryptor.final()]);

    // 4. Đóng gói kết quả (Binary Packing chuẩn Zego)
    const resultBuffer = Buffer.concat([
      Buffer.from(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1])), // Version
      Buffer.from(new Uint8Array([0, 0, 0, 0])),             // Signature placeholder
      iv,
      Buffer.from(new Uint16Array([encrypted.length]).buffer).reverse(), // Content Length
      encrypted,
    ] as any);

    return '04' + resultBuffer.toString('base64');
  }
}