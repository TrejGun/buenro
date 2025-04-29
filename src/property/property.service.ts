import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, AnyBulkWriteOperation } from "mongoose";
// import { BulkWriteResult } from "mongodb";

import { PropertyDocument, PropertyModel } from "./property.model";
import type { IProperty, IPropertySearchDto } from "./interfaces";
import { SortDirection } from "./dto";

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel(PropertyModel.name)
    private propertyModel: Model<PropertyDocument>,
  ) {}

  async search(dto: IPropertySearchDto) {
    const {
      externalId,
      name,
      country,
      city,
      isAvailable,
      minPrice,
      maxPrice,
      priceSegment,
      skip = 0,
      limit = 20,
      sortBy = "priceForNight",
      sortOrder = SortDirection.asc,
    } = dto;

    const query: Record<string, any> = {};

    if (externalId) {
      query.externalId = externalId;
    }

    if (name) {
      query.name = {
        $regex: name,
        $options: "i",
      };
    }

    if (country) {
      query.country = country;
    }

    if (city) {
      query.city = city;
    }

    if (typeof isAvailable === "boolean") {
      query.isAvailable = isAvailable;
    }

    if (priceSegment) {
      query.priceSegment = priceSegment;
    }

    if (minPrice != null || maxPrice != null) {
      query.priceForNight = {};
      if (minPrice != null) {
        query.priceForNight.$gte = minPrice;
      }
      if (maxPrice != null) {
        query.priceForNight.$lte = maxPrice;
      }
    }

    const sortDirection = sortOrder === SortDirection.asc ? 1 : -1;

    const rows = await this.propertyModel
      .find(query)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limit)
      .exec();

    const count = await this.propertyModel.countDocuments(query);

    return { rows, count };
  }

  public findOne(where: FilterQuery<PropertyDocument>): Promise<PropertyDocument | null> {
    return this.propertyModel.findOne(where).exec();
  }

  public findById(id: string): Promise<PropertyDocument | null> {
    return this.propertyModel.findById(id).exec();
  }

  public findOneAndUpdate(where: FilterQuery<PropertyDocument>, data: IProperty): Promise<PropertyDocument | null> {
    return this.propertyModel.findOneAndUpdate(where, data, { upsert: true }).exec();
  }

  public bulkWrite(data: Array<AnyBulkWriteOperation<any>>): Promise<any> {
    // BulkWriteResult
    return this.propertyModel.bulkWrite(data);
  }
}
