import "reflect-metadata";
import {
  Attr,
  getPartialModelMetadata,
  HashKey,
  Model,
  RangeKey,
  Version,
} from "./decorator";
import { StringMapper } from "./mapper";
import { ModelMetadata } from "./metadata";

describe("decorator", () => {
  it("test", () => {
    @Model({ tableName: "Users" })
    class UserModel {
      @HashKey()
      @Attr(StringMapper())
      userId!: string;

      @RangeKey()
      @Attr(StringMapper())
      userName!: string;

      @Attr(StringMapper())
      age!: number;

      @Version()
      @Attr(StringMapper())
      version!: number;
    }

    expect(getPartialModelMetadata(UserModel)).toEqual<
      ModelMetadata<UserModel>
    >({
      modelClass: UserModel,
      tableName: "Users",
      hashKeyName: "userId",
      rangeKeyName: "userName",
      versionAttrName: "version",
      attributes: {
        userId: {
          attrName: "userId",
          optional: false,
          marshall: StringMapper().marshall,
          unmarshall: StringMapper().unmarshall,
        },
        userName: {
          attrName: "userName",
          optional: false,
          marshall: StringMapper().marshall,
          unmarshall: StringMapper().unmarshall,
        },
        age: {
          attrName: "age",
          optional: false,
          marshall: StringMapper().marshall,
          unmarshall: StringMapper().unmarshall,
        },
        version: {
          attrName: "version",
          optional: false,
          marshall: StringMapper().marshall,
          unmarshall: StringMapper().unmarshall,
        },
      },
    });
  });
});
