import { BaseModel } from "./base.model";
import { DynamoDBItem } from "./client";
import { AttributeMetadata, ModelMetadata } from "./metadata";

export const marshaller = <T extends BaseModel>(
  metadata: ModelMetadata<T>,
  model: T
): DynamoDBItem => {
  const item: DynamoDBItem = {};

  for (const attr of Object.values<AttributeMetadata<T> | undefined>(
    metadata.attributes
  )) {
    if (attr === undefined) {
      continue;
    }
    const attrName = attr.attrName;
    const attrValue = model[attrName as keyof T];
    item[attrName.toString()] = attr.marshall(attrValue);
  }

  return item;
};

export const unmarshaller = <T extends BaseModel>(
  metadata: ModelMetadata<T>,
  item: DynamoDBItem
): T => {
  const model = new metadata.modelClass();

  for (const attr of Object.values<AttributeMetadata<T> | undefined>(
    metadata.attributes
  )) {
    if (attr === undefined) {
      continue;
    }
    const attrName = attr.attrName;
    const itemValue = item[attrName.toString()];
    const attrValue = attr.unmarshall(itemValue);

    model[attrName] = attrValue;
  }

  return model;
};
