export class RedisPubPayload {
  channel: string;
  message: string;

  constructor(channel: string, message: string) {
    this.channel = channel;
    this.message = message;
  }

  toBuffer() {
    return Buffer.from(this.message);
  }

  toJSON() {
    try {
      return JSON.parse(this.message);
    } catch {
      return null;
    }
  }
}
