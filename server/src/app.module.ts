import { Module, DynamicModule, Type } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./modules/users/users.module";
import { AdminModule } from "./modules/admin/admin.module";
import { HealthcareHomesModule } from "./modules/healthcare-homes/healthcare-homes.module";
import { CoreModule } from "./modules/core/core.module";
import { AuthModule } from "./modules/auth/auth.module";
import { configuration } from "./configs/configuration";
import jwtConfig from "./configs/jwt.config";
import { dataSourceOptions } from "./configs/orm";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration, jwtConfig],
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    CoreModule,
    AuthModule,
    UsersModule,
    AdminModule,
    HealthcareHomesModule,
  ] as (Type<any> | DynamicModule | Promise<DynamicModule>)[],
})
export class AppModule {}
