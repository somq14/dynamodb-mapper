import { DynamoDBAttr } from "../common";

export interface Mapper<T> {
  marshall: (value: T) => DynamoDBAttr;
  unmarshall: (value: DynamoDBAttr) => T;
}
