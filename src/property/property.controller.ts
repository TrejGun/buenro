import { Controller, Get, Param, Query } from "@nestjs/common";

import { PropertyService } from "./property.service";
import { PropertyDocument } from "./property.model";
import { PropertySearchDto } from "./dto";

@Controller("/properties")
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get("/")
  public search(@Query() dto: PropertySearchDto): Promise<{ rows: Array<PropertyDocument>; count: number }> {
    return this.propertyService.search(dto);
  }

  @Get("/:id")
  public findById(@Param("id") id: string): Promise<PropertyDocument | null> {
    return this.propertyService.findById(id);
  }
}
