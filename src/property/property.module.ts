import { Module, Logger } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { PropertyService } from "./property.service";
import { PropertyModel, PropertySchema } from "./property.model";
import { PropertyCron } from "./property.cron";
import { PropertyController } from "./property.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PropertyModel.name,
        schema: PropertySchema,
      },
    ]),
  ],
  providers: [Logger, PropertyService, PropertyCron],
  controllers: [PropertyController],
  exports: [PropertyService],
})
export class PropertyModule {}
