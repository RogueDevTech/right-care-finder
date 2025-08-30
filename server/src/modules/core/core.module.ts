import { Module, Global } from "@nestjs/common";
import { BcryptService } from "./services/bcrypt.service";
import { EmailService } from "./services/email.service";

@Global()
@Module({
  providers: [BcryptService, EmailService],
  exports: [BcryptService, EmailService],
})
export class CoreModule {}
