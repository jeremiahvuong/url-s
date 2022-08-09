import argon2 from "argon2";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { COOKIE_NAME } from "../constants";
import { User } from "../entities/User";
import { AppDataSource } from "../ormconfig";
import { MyContext } from "../types";
import { validateEmail } from "../utils/validateEmail";
import { validatePassword } from "../utils/validatePassword";
import { validateUsername } from "../utils/validateUsername";
import { UsernamePasswordInput } from "./inputs/UsernamePasswordInput";
import { UserResponse } from "./responses/UserResponse";

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    const sessionId = req.session.userId;

    // not logged in
    if (!sessionId) {
      return null;
    }

    return User.findOne({ where: { id: sessionId } });
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const emailErrors = validateEmail(options.email);
    const usernameErrors = validateUsername(options.username);
    const passwordErrors = validatePassword(options.password);

    if (emailErrors) {
      return { errors: emailErrors };
    }

    if (usernameErrors) {
      return { errors: usernameErrors };
    }

    if (passwordErrors) {
      return { errors: passwordErrors };
    }

    const hashedPassword = await argon2.hash(options.password);
    let user;

    try {
      const result = await AppDataSource.createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username: options.username.toLowerCase(),
          email: options.email,
          password: hashedPassword,
        })
        .returning("*")
        .execute();
      user = result.raw[0];
    } catch (err) {
      if (err.code === "23505" && err.detail.includes("(username)")) {
        return {
          errors: [
            {
              field: "username",
              message: "username already taken",
            },
          ],
        };
      }

      if (err.code === "23505" && err.detail.includes("(email)")) {
        return {
          errors: [
            {
              field: "email",
              message: "email already taken",
            },
          ],
        };
      }
    }

    // store user id session
    // this will set a cookie on the user
    // keep them logged in
    req.session.userId = user.id;

    // await AppDataSource.createQueryBuilder()
    //   .insert()
    //   .into(Profile)
    //   .values({
    //     username: options.username.toLowerCase(),
    //     id: req.session.userId,
    //   })
    //   .returning("*")
    //   .execute();

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(
      usernameOrEmail.includes("@")
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
    );

    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "that username doesn't exist",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }
}
