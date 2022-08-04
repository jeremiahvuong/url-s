import { AppDataSource } from "../ormconfig";
import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Link } from "../entities/Link";
import crypto from "crypto";

@Resolver()
export class LinkResolver {
  @Mutation(() => Link)
  async shorten(@Arg("link") link: string) {
    // replace https to http
    if (link.includes("https://") && !link.includes("http://")) {
      link = link.replace("https://", "http://");
    }

    // require http://
    if (!link.includes("http://" || "https://")) {
      link = `http://${link}`;
    }

    if (!link.endsWith("/")) {
      link = `${link}/`;
    }

    const linkExists = await Link.findOne({ where: { link } });

    if (linkExists) {
      return linkExists;
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
