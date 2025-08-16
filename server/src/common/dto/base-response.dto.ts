import { ApiProperty } from "@nestjs/swagger";

export class BaseResponseDto<T> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  total?: number;

  @ApiProperty()
  page?: number;

  @ApiProperty()
  per_page?: number;

  @ApiProperty()
  total_pages?: number;

  @ApiProperty()
  data?: T;

  @ApiProperty()
  error?: string;

  constructor(success: boolean, message: string, data?: T, error?: string) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
  }

  static success<T>(message: string, data?: T): BaseResponseDto<T> {
    return new BaseResponseDto<T>(true, message, data);
  }

  static error(message: string, error?: string): BaseResponseDto<null> {
    return new BaseResponseDto<null>(false, message, null, error);
  }
}
