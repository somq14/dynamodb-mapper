import "reflect-metadata";
import { BaseModel } from "./base.model";
import { ClassOf, DynamoDBAttr } from "./common";

export type AttributeMetadata<T extends BaseModel> = {
  attrName: keyof T;
  optional: boolean;
  marshall: (value: any) => DynamoDBAttr;
  unmarshall: (value: DynamoDBAttr) => any;
};

export type ModelMetadata<T extends BaseModel> = {
  modelClass: ClassOf<T>;
  tableName: string;
  attributes: {
    [attrName in keyof T]?: AttributeMetadata<T>;
  };
  hashKeyName: keyof T;
  rangeKeyName?: keyof T;
  versionAttrName?: keyof T;
};

export type PartialModelMetadata<T extends BaseModel> = {
  modelClass?: ClassOf<T>;
  tableName?: string;
  attributes: {
    [attrName in keyof T]?: AttributeMetadata<T>;
  };
  hashKeyName?: keyof T;
  rangeKeyName?: keyof T;
  versionAttrName?: keyof T;
};

export const getPartialModelMetadata = <T extends BaseModel>(
  target: Object
): PartialModelMetadata<T> => {
  const suffix = "0ad1a838-b9b4-4b17-d3a6-2217f5393e61";
  const key = `dynamodb-mapper-model-${suffix}`;

  let metadata = Reflect.getMetadata(key, target) as
    | PartialModelMetadata<T>
    | undefined;
  if (metadata === undefined) {
    metadata = { attributes: {} };
    Reflect.defineMetadata(target, metadata, target);
  }

  return metadata;
};

export const getModelMetadata = <T extends BaseModel>(
  target: Object
): ModelMetadata<T> => {
  const metadata = getPartialModelMetadata<T>(target);
  if (
    metadata.modelClass === undefined ||
    metadata.tableName === undefined ||
    metadata.hashKeyName === undefined
  ) {
    throw new Error(); // TODO
  }
  return {
    modelClass: metadata.modelClass,
    tableName: metadata.tableName,
    attributes: metadata.attributes,
    hashKeyName: metadata.hashKeyName,
    rangeKeyName: metadata.rangeKeyName,
    versionAttrName: metadata.versionAttrName,
  };
};
