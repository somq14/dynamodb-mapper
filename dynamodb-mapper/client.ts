import { AttributeValue, DynamoDBClient } from "@aws-sdk/client-dynamodb";

export type DynamoDBAttr = AttributeValue;
export type DynamoDBItem = { [key: string]: DynamoDBAttr };
export type DynamoDBKey = { [key: string]: DynamoDBAttr };
export type DynamoDBKeyType = string | number | Uint8Array;

export class Client {
  private client: DynamoDBClient;

  constructor() {
    this.client = new DynamoDBClient({
      endpoint: "http://localhost:8000",
    });
  }
}
