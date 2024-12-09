import { AgeRestriction } from '../entity/ageRestriction';

export class AgeRestrictionMapper {
  static toDomain(ageRestriction: number | string): AgeRestriction {
    switch (ageRestriction) {
      case 0:
        return AgeRestriction.ALL;
      case 7:
        return AgeRestriction.PG_7;
      case 13:
        return AgeRestriction.PG_13;
      case 17:
        return AgeRestriction.R;
      case 18:
        return AgeRestriction.NC_17;
      default:
        throw new Error(`Invalid age restriction: ${ageRestriction}`);
    }
  }
}
