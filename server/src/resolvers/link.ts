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
import { LinkResponse } from "./responses/LinkResponse";

@Resolver()
export class LinkResolver {
  @UseMiddleware(isAuthenticated)
  @Mutation(() => LinkResponse)
  async shorten(
    @Arg("link") link: string,
    @Ctx() { req }: MyContext
  ): Promise<LinkResponse> {
    let temp;
    if (link.length < 3) {
      return {
        errors: [
          {
            field: "link",
            message: "link must be 3 characters or longer",
          },
        ],
      };
    }

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

    const hash = crypto.randomBytes(3).toString("hex");

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

    temp = result.raw[0];

    return { link: temp };
  }

  @UseMiddleware(isAuthenticated)
  @Mutation(() => Boolean)
  async delete(@Arg("id") id: number, @Ctx() { req }: MyContext) {
    const link = await Link.findOne({ where: { id } });

    if (!link) {
      return false;
    }

    // If user is not author
    if (link.creatorId !== req.session.userId) {
      throw new Error("not authorized");
    }

    await Link.delete({ id, creatorId: req.session.userId });
    return true;
  }

  @UseMiddleware()
  @Mutation(() => LinkResponse)
  async updateLink(
    @Arg("id") id: number,
    @Arg("link") link: string,
    @Arg("hash") hash: string,
    @Ctx() { req }: MyContext
  ): Promise<LinkResponse> {
    let temp;

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

    if (hash.length < 3) {
      return {
        errors: [
          {
            field: "hash",
            message: "hash must be 3 characters or longer",
          },
        ],
      };
    }

    try {
      const result = await AppDataSource.createQueryBuilder()
        .update(Link)
        .set({ link, hash })
        .where('id = :id and "creatorId" = :creatorId', {
          id,
          creatorId: req.session.userId,
        })
        .returning("*")
        .execute();
      temp = result.raw[0];
    } catch (err) {
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "hash",
              message: "hash already taken",
            },
          ],
        };
      }
    }

    return { link: temp };
  }

  @Query(() => Link, { nullable: true })
  async linkByHash(@Arg("hash") hash: string): Promise<Link | null> {
    const link = await Link.findOne({ where: { hash } });

    return link;
  }

  // having one query does not work due to different arg types
  // we can have 2 args with one dead however this
  // is the best option

  @Query(() => Link, { nullable: true })
  async linkById(@Arg("id") id: number): Promise<Link | null> {
    const link = await Link.findOne({ where: { id } });

    return link;
  }

  @UseMiddleware(isAuthenticated)
  @Query(() => [Link], { nullable: true })
  async myLinks(@Ctx() { req }: MyContext) {
    return AppDataSource.getRepository(Link)
      .createQueryBuilder()
      .where({ creatorId: req.session.userId })
      .orderBy('"updatedAt"')
      .getMany();
  }
}
