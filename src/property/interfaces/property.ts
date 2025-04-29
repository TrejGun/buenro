export interface IProperty {
  externalId: string;
  name?: string;
  country?: string;
  city: string;
  isAvailable: boolean;
  priceForNight: number;
  priceSegment?: string;
}
