import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBMapper } from "../src/dynamodb-mapper";
import { ModelMetadata } from "../src/metadata";
import { UserModel } from "./user.model";

export class UserMapper extends DynamoDBMapper<UserModel, string, string> {
  constructor(client: DynamoDBClient, metadata: ModelMetadata<UserModel>) {
    super(client, metadata);
  }
}

// const client = new UserMapper(new DynamoDBClient({}));
