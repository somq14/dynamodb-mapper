import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBMapper } from "../dynamodb-mapper/dynamodb-mapper";
import { ModelMetadata } from "../dynamodb-mapper/metadata";
import { UserModel } from "./user.model";

export class UserMapper extends DynamoDBMapper<UserModel, string, string> {
  constructor(client: DynamoDBClient, metadata: ModelMetadata<UserModel>) {
    super(client, metadata);
  }
}

// const client = new UserMapper(new DynamoDBClient({}));
