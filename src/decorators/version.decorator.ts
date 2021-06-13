import { getPartialModelMetadata } from "../metadata";

export const Version = (): PropertyDecorator => (target, propertyKey) => {
  const metadata = getPartialModelMetadata<any>(target.constructor);
  metadata.versionAttrName = propertyKey.toString();
};
