import { DynamoDBAttr } from "../common";
import { Mapper } from "./mapper";

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
