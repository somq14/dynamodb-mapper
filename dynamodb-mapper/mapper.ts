import { BaseModel } from "./base.model";
import { DynamoDBAttr } from "./client";
import { ClassOf } from "./common";
import { getModelMetadata } from "./decorator";
import { marshaller, unmarshaller } from "./marshaller";

export interface Mapper<T> {
  marshall: (value: T) => DynamoDBAttr;
  unmarshall: (value: DynamoDBAttr) => T;
}

export const StringMapper = (): Mapper<string> => {
  return {
    marshall: (value: string) => ({ S: value }),
    unmarshall: (value: DynamoDBAttr) => {
      if (value.S === undefined) {
        throw new TypeError(`StringMapper: ${value}`);
      }
      return value.S;
    },
  };
};

export const ObjectMapper = <T extends BaseModel>(modelClass: ClassOf<T>) => {
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
