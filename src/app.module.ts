import { Module } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { RedisModule, RedisModuleOptions } from "@liaoliaots/nestjs-redis";

import { HttpValidationPipe } from "./common/pipes";
import { DatabaseModule } from "./database/database.module";
import { PropertyModule } from "./property/property.module";
import { LOCK_STORE } from "./property/constants";
import { AppController } from "./app.controller";

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: HttpValidationPipe,
    },
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
    }),
    ScheduleModule.forRoot(),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): RedisModuleOptions => {
        const redisUrl = configService.get<string>("REDIS_URL", "redis://127.0.0.1:6379/1");
        return {
          config: [
            {
              namespace: LOCK_STORE,
              url: redisUrl,
            },
          ],
        };
      },
    }),
    DatabaseModule,
    PropertyModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
