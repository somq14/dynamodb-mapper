import "reflect-metadata";
import { BaseModel } from "../src/base.model";
import { Attr, HashKey, Model, RangeKey, Version } from "../src/decorators";
import { StringMapper } from "../src/mappers/string.mapper";

@Model({ tableName: `Users` })
export class UserModel extends BaseModel {
  @HashKey()
  userId: string;

  @RangeKey()
  @Attr(StringMapper(), { nullable: true })
  userName: string;

  @Attr(StringMapper())
  lastLoginTime: Date;

  @Attr(StringMapper())
  roles: Set<string>;

  @Version()
  @Attr(StringMapper())
  version: number;

  constructor(obj: UserModel) {
    super();
    this.userId = obj.userId;
    this.userName = obj.userName;
    this.lastLoginTime = obj.lastLoginTime;
    this.version = obj.version;
    this.roles = obj.roles;
  }
}
