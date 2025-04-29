import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

import type { IProperty } from "./interfaces";

@Schema({ versionKey: false })
export class PropertyModel implements IProperty {
  @Prop()
  public externalId: string;

  @Prop()
  public name?: string;

  @Prop()
  public country?: string;

  @Prop()
  public city: string;

  @Prop()
  public isAvailable: boolean;

  @Prop()
  public priceForNight: number;

  @Prop()
  public priceSegment: string;
}

export type PropertyDocument = PropertyModel & Document;

export const PropertySchema = SchemaFactory.createForClass(PropertyModel);

PropertySchema.index({ externalId: 1 });
PropertySchema.index({ name: "text" });
