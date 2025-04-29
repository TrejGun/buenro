export interface IPropertySearchDto {
  externalId?: string;
  name?: string;
  country?: string;
  city?: string;
  isAvailable?: boolean;
  minPrice?: number;
  maxPrice?: number;
  priceSegment?: string;
  skip?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
