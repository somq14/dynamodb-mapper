import { BaseModel } from "./base.model";
import { ClassOf } from "./common";
import { Mapper } from "./mapper";
import { AttributeMetadata, ModelMetadata } from "./metadata";

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

export const Model =
  (params: { tableName: string }): ClassDecorator =>
  (target) => {
    const metadata = getPartialModelMetadata(target);
    metadata.modelClass = target as any; // FIXME
    metadata.tableName = params.tableName;
  };

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

export const HashKey = (): PropertyDecorator => (target, propertyKey) => {
  const metadata = getPartialModelMetadata<any>(target.constructor);
  metadata.hashKeyName = propertyKey.toString();
};

export const RangeKey = (): PropertyDecorator => (target, propertyKey) => {
  const metadata = getPartialModelMetadata<any>(target.constructor);
  metadata.rangeKeyName = propertyKey.toString();
};

export const Version = (): PropertyDecorator => (target, propertyKey) => {
  const metadata = getPartialModelMetadata<any>(target.constructor);
  metadata.versionAttrName = propertyKey.toString();
};
