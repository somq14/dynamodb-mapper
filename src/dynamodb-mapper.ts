import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { BaseModel } from "./base.model";
import {
  DynamoDBAttr,
  DynamoDBItem,
  DynamoDBKey,
  DynamoDBKeyType,
  Optional,
} from "./common";
import { marshaller, unmarshaller } from "./marshaller";
import { ModelMetadata } from "./metadata";

export abstract class DynamoDBMapper<
  ModelType extends BaseModel,
  HashKeyType = DynamoDBKeyType,
  RangeKeyType = undefined
> {
  constructor(
    protected readonly client: DynamoDBClient,
    private readonly metadata: ModelMetadata<ModelType>
  ) {}

  protected getTableName(): string {
    return this.metadata.tableName;
  }

  protected isEnabledAutoOptimisticLock(): boolean {
    return this.metadata.versionAttrName !== undefined;
  }

  protected getVersionAttrName(): keyof ModelType {
    if (this.metadata.versionAttrName === undefined) {
      throw new Error(); // TODO
    }
    return this.metadata.versionAttrName;
  }

  protected marshallVersion(model: ModelType): DynamoDBAttr {
    const { versionAttrName, attributes } = this.metadata;
    if (versionAttrName === undefined) {
      throw new Error(); // TODO
    }
    const value = model[versionAttrName];
    const attr = attributes[versionAttrName];
    if (attr === undefined) {
      throw new Error(); // TODO
    }
    return attr.marshall(value);
  }

  protected marshall(model: ModelType): DynamoDBItem {
    return marshaller(this.metadata, model);
  }

  protected unmarshall(item: DynamoDBItem): ModelType {
    return unmarshaller(this.metadata, item);
  }

  protected marshallHashKey(hashKey: HashKeyType): DynamoDBKey {
    const { hashKeyName, attributes } = this.metadata;
    const attribute = attributes[hashKeyName];
    if (attribute === undefined) {
      throw new Error();
    }
    return { [hashKeyName]: attribute.marshall(hashKey) };
  }

  protected marshallRangeKey(rangeKey?: RangeKeyType): DynamoDBKey {
    const { rangeKeyName, attributes } = this.metadata;
    if (rangeKeyName === undefined) {
      return {};
    }
    const attribute = attributes[rangeKeyName];
    if (attribute === undefined) {
      throw new Error();
    }
    return { [rangeKeyName]: attribute.marshall(rangeKey) };
  }

  protected marshallKey(
    hashKey: HashKeyType,
    rangeKey?: RangeKeyType
  ): DynamoDBKey {
    return {
      ...this.marshallHashKey(hashKey),
      ...this.marshallRangeKey(rangeKey),
    };
  }

  async get(
    hashKey: HashKeyType,
    rangeKey?: RangeKeyType
  ): Promise<Optional<ModelType>> {
    const res = await this.client.send(
      new GetItemCommand({
        TableName: this.getTableName(),
        Key: this.marshallKey(hashKey, rangeKey),
      })
    );
    if (res.Item === undefined) {
      return undefined;
    }
    return this.unmarshall(res.Item);
  }

  async put(model: ModelType) {
    const versionAttrName = this.getVersionAttrName() as keyof ModelType &
      string;

    const version = this.marshallVersion(model);
    try {
      await this.client.send(
        new PutItemCommand({
          TableName: this.getTableName(),
          Item: this.marshall(model),
          ConditionExpression: "#V = :V - 1",
          ExpressionAttributeNames: {
            "#V": versionAttrName,
          },
          ExpressionAttributeValues: {
            ":V": version,
          },
        })
      );
    } catch (err) {
      console.error(err);
    }
  }

  async delete(hashKey: HashKeyType, rangeKey?: RangeKeyType) {
    try {
      await this.client.send(
        new DeleteItemCommand({
          TableName: this.getTableName(),
          Key: this.marshallKey(hashKey, rangeKey),
        })
      );
    } catch (err) {
      console.error(err);
    }
  }
}
