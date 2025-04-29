import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBooleanString, IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";

import type { IPropertySearchDto } from "../interfaces";

export enum SortDirection {
  asc = "asc",
  desc = "desc",
}

export class PropertySearchDto implements IPropertySearchDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  externalId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional()
  @IsBooleanString()
  @IsOptional()
  isAvailable?: boolean;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  minPrice?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  maxPrice?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  priceSegment?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(1)
  skip?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({
    enum: SortDirection,
  })
  @IsEnum(SortDirection)
  @IsOptional()
  sortOrder?: SortDirection;
}
