import { getPartialModelMetadata } from "../metadata";

export const HashKey = (): PropertyDecorator => (target, propertyKey) => {
  const metadata = getPartialModelMetadata<any>(target.constructor);
  metadata.hashKeyName = propertyKey.toString();
};
