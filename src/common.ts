import { AttributeValue } from "@aws-sdk/client-dynamodb";

export type ClassOf<T> = { new (...args: any): T };
export type Optional<T> = T | undefined;

export type DynamoDBAttr = AttributeValue;
export type DynamoDBItem = { [key: string]: DynamoDBAttr };
export type DynamoDBKey = { [key: string]: DynamoDBAttr };
export type DynamoDBKeyType = string | number | Uint8Array;
