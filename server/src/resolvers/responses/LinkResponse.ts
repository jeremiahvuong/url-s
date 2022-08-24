import { ObjectType, Field } from "type-graphql";
import { FieldError } from "./FieldError";
import { Link } from "../../entities/Link";

@ObjectType()
export class LinkResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Link, { nullable: true })
  link?: Link;
}
