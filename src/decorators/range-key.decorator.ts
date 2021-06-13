import { getPartialModelMetadata } from "../metadata";

export const RangeKey = (): PropertyDecorator => (target, propertyKey) => {
  const metadata = getPartialModelMetadata<any>(target.constructor);
  metadata.rangeKeyName = propertyKey.toString();
};
