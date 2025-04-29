import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { parser } from "stream-json";
import { streamArray } from "stream-json/streamers/StreamArray";
import { pipeline } from "stream";
import { RedisManager } from "@liaoliaots/nestjs-redis";
// import { createGunzip } from 'zlib';

import { PropertyService } from "./property.service";
import type { ILargeData, IStructuredData } from "./interfaces";
import { BATCH_SIZE, LOCK_STORE } from "./constants";
import { hashToObjectId } from "./utils";

@Injectable()
export class PropertyCron {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly propertyService: PropertyService,
    private readonly redisManager: RedisManager,
  ) {
    void this.redisManager.getClient(LOCK_STORE).del("structured");
    void this.redisManager.getClient(LOCK_STORE).del("large");
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async getStructuredData(): Promise<void> {
    const isLocked = await this.redisManager.getClient(LOCK_STORE).set("structured", "locked", "EX", 600, "NX");

    if (!isLocked) {
      this.loggerService.log("This cron job is already running on another instance.");
      return;
    }

    const response = await fetch(
      "https://buenro-tech-assessment-materials.s3.eu-north-1.amazonaws.com/structured_generated_data.json",
    );

    if (!response.ok) {
      throw new Error("Failed to fetch or no body in response");
    }

    if (!response.body) {
      throw new Error("No body in response");
    }

    const bulkOps: Array<any> = []; // Collect operations here

    pipeline(
      response.body,
      // createGunzip(),
      parser(),
      streamArray(),
      async (source: AsyncIterable<{ value: IStructuredData }>) => {
        for await (const { value } of source) {
          bulkOps.push({
            updateOne: {
              filter: {
                _id: hashToObjectId(value.id.toString()),
              },
              update: {
                $set: {
                  externalId: value.id.toString(),
                  name: value.name,
                  country: value.address.country,
                  city: value.address.city,
                  isAvailable: value.isAvailable,
                  priceForNight: value.priceForNight,
                },
              },
              upsert: true,
            },
          });

          if (bulkOps.length === BATCH_SIZE) {
            await this.propertyService.bulkWrite(bulkOps);
            bulkOps.length = 0;
          }
        }

        if (bulkOps.length) {
          await this.propertyService.bulkWrite(bulkOps);
        }
      },
      async err => {
        if (err) {
          this.loggerService.error("Pipeline failed", err);
        } else {
          this.loggerService.log("Pipeline succeeded");
        }

        await this.redisManager.getClient(LOCK_STORE).del("structured");
      },
    );
  }

  @Cron(CronExpression.EVERY_MINUTE)
  public async getLargeData(): Promise<void> {
    const isLocked = await this.redisManager.getClient(LOCK_STORE).set("large", "locked", "EX", 600, "NX");

    if (!isLocked) {
      this.loggerService.log("This cron job is already running on another instance.");
      return;
    }

    const response = await fetch(
      "https://buenro-tech-assessment-materials.s3.eu-north-1.amazonaws.com/large_generated_data.json",
    );

    if (!response.ok) {
      throw new Error("Failed to fetch or no body in response");
    }

    if (!response.body) {
      throw new Error("No body in response");
    }

    const bulkOps: Array<any> = []; // Collect operations here

    pipeline(
      response.body,
      // createGunzip(),
      parser(),
      streamArray(),
      async (source: AsyncIterable<{ value: ILargeData }>) => {
        for await (const { value } of source) {
          bulkOps.push({
            updateOne: {
              filter: {
                _id: hashToObjectId(value.id),
              },
              update: {
                $set: {
                  externalId: value.id,
                  city: value.city,
                  isAvailable: value.availability,
                  priceForNight: value.pricePerNight,
                  priceSegment: value.priceSegment,
                },
              },
              upsert: true,
            },
          });

          if (bulkOps.length === 1000) {
            await this.propertyService.bulkWrite(bulkOps);
            bulkOps.length = 0;
          }
        }

        if (bulkOps.length) {
          await this.propertyService.bulkWrite(bulkOps);
        }
      },
      async err => {
        if (err) {
          this.loggerService.error("Pipeline failed", err);
        } else {
          this.loggerService.log("Pipeline succeeded");
        }

        await this.redisManager.getClient(LOCK_STORE).del("large");
      },
    );
  }
}
