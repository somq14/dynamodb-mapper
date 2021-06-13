import { BaseModel } from "./base.model";
import { DynamoDBAttr } from "./client";
import { ClassOf } from "./common";

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
