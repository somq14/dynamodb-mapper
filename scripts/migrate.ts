import {
  CreateTableCommand,
  DeleteTableCommand,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

const main = async () => {
  const client = DynamoDBDocumentClient.from(
    new DynamoDBClient({ endpoint: "http://localhost:8000" })
  );

  await client.send(
    new DeleteTableCommand({
      TableName: "Items",
    })
  );

  await client.send(
    new CreateTableCommand({
      TableName: "Items",
      AttributeDefinitions: [{ AttributeName: "itemId", AttributeType: "S" }],
      KeySchema: [{ AttributeName: "itemId", KeyType: "HASH" }],
      BillingMode: "PAY_PER_REQUEST",
    })
  );

  await client.send(
    new PutCommand({
      TableName: "Items",
      Item: {
        itemId: "id",
        sAttr: "string",
        nAttr: 123,
        bnAttr: 123456n,
        nnAttr: { value: "123456789" },
        nullAttr: null,
        // undefinedAttr: undefined,
        trueAttr: true,
        falseAttr: false,
        arrayAttr: [1, 2, 3],
        setAttr: new Set([1, 2, 3]),
      },
    })
  );
  const res = await client.send(
    new GetCommand({
      TableName: "Items",
      Key: { itemId: "id" },
    })
  );
  console.info(res);
};

main();
