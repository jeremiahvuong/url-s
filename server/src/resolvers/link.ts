import { Resolver, Query } from "type-graphql";

@Resolver()
export class LinkResolver {
  @Query(() => String)
  hello() {
    return "bye";
  }
}
