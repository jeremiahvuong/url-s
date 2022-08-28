import { cacheExchange } from "@urql/exchange-graphcache";
import Router from "next/router";
import { dedupExchange, Exchange, fetchExchange } from "urql";
import { pipe, tap } from "wonka";
import {
  DeleteMutationVariables,
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  MyLinksDocument,
  MyLinksQuery,
  RegisterMutation,
  ShortenMutation,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";

const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error?.message.includes("not authenticated")) {
          Router.replace("/login");
        }
      })
    );
  };

export const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          logout: (_result, args, cache, info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            );

            // re-route to login
            Router.replace("/login");
          },
          login: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
          },
          register: (_result, args, cache, info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
          },
          delete: (_result, args, cache, info) => {
            cache.invalidate({
              __typename: "Link",
              id: (args as DeleteMutationVariables).id,
            });
          },
          shorten: (_result, args, cache, info) => {
            betterUpdateQuery<ShortenMutation, MyLinksQuery>(
              cache,
              { query: MyLinksDocument },
              _result,
              (result, query) => {
                // @ts-ignore typing compat error?
                query.myLinks?.push(result.shorten.link);
                return query;
              }
            );
          },
        },
      },
    }),
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
});
