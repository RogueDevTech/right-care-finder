import { Module, Global } from "@nestjs/common";
import { BcryptService } from "./services/bcrypt.service";

@Global()
@Module({
  providers: [BcryptService],
  exports: [BcryptService],
})
export class CoreModule {}
