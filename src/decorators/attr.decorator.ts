import { Mapper } from "../mappers";
import { AttributeMetadata, getPartialModelMetadata } from "../metadata";

export const Attr =
  <T>(mapper: Mapper<T>, opts?: { nullable: boolean }): PropertyDecorator =>
  (target, propertyKey) => {
    const metadata = getPartialModelMetadata<any>(target.constructor);
    const attrName = propertyKey.toString() as any;

    const attrMetadata: AttributeMetadata<any> = {
      attrName: attrName,
      optional: opts?.nullable === true ? true : false,
      marshall: mapper.marshall,
      unmarshall: mapper.unmarshall,
    };

    metadata.attributes[attrName] = attrMetadata;
  };
