import { AppDataSource } from "../ormconfig";
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  UseMiddleware,
  Ctx,
} from "type-graphql";
import { Link } from "../entities/Link";
import crypto from "crypto";
import { isAuthenticated } from "../middleware/isAuthenticated";
import { MyContext } from "../types";

@Resolver()
export class LinkResolver {
  @UseMiddleware(isAuthenticated)
  @Mutation(() => Link)
  async shorten(@Arg("link") link: string, @Ctx() { req }: MyContext) {
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

    const hash = crypto.randomBytes(2).toString("hex");

    const result = await AppDataSource.createQueryBuilder()
      .insert()
      .into(Link)
      .values({
        link,
        hash,
        creatorId: req.session.userId,
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
