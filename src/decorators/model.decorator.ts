import { getPartialModelMetadata } from "../metadata";

export const Model =
  (params: { tableName: string }): ClassDecorator =>
  (target) => {
    const metadata = getPartialModelMetadata(target);
    metadata.modelClass = target as any; // FIXME
    metadata.tableName = params.tableName;
  };
