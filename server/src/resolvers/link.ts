import { AppDataSource } from "../ormconfig";
import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Link } from "../entities/Link";
import crypto from "crypto";

@Resolver()
export class LinkResolver {
  @Mutation(() => Link)
  async shorten(@Arg("link") link: string) {
    const exist = await Link.findOne({ where: { link } });

    if (exist) {
      return exist;
    }

    const hash = crypto.randomBytes(2).toString("hex");
    const result = await AppDataSource.createQueryBuilder()
      .insert()
      .into(Link)
      .values({
        link,
        hash,
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  @Query(() => Link)
  link(@Arg("hash") hash: string) {
    return Link.findOne({ where: { hash } });
  }
}
