import { BaseModel } from "../base.model";
import { ClassOf, DynamoDBAttr } from "../common";
import { marshaller, unmarshaller } from "../marshaller";
import { getModelMetadata } from "../metadata";
import { Mapper } from "./mapper";

export const ObjectMapper = <T extends BaseModel>(
  modelClass: ClassOf<T>
): Mapper<T> => {
  return {
    marshall: (model: T): DynamoDBAttr => {
      const metadata = getModelMetadata<T>(modelClass);
      return { M: marshaller(metadata, model) };
    },
    unmarshall: (item: DynamoDBAttr): T => {
      const metadata = getModelMetadata<T>(modelClass);
      if (item.M === undefined) {
        throw new Error(); // TODO
      }
      return unmarshaller(metadata, item.M);
    },
  };
};
