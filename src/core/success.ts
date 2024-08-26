export class SussessResponse {
  constructor(
    private message: string,
    private statusCode: number,
    private metadata?: any,
  ) {}
  send() {
    console.log({ message: this.message, status: this.statusCode });
    return this;
  }
}
export class CreatedResponse extends SussessResponse {
  constructor(message: string, statusCode: number, metadata?: any) {
    super(message, statusCode, metadata);
  }
}
