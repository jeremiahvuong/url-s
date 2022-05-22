import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Link = {
  __typename?: 'Link';
  createdAt: Scalars['String'];
  hash: Scalars['String'];
  id: Scalars['Float'];
  link: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  shorten: Link;
};


export type MutationShortenArgs = {
  link: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  link: Link;
};


export type QueryLinkArgs = {
  hash: Scalars['String'];
};

export type ShortenMutationVariables = Exact<{
  link: Scalars['String'];
}>;


export type ShortenMutation = { __typename?: 'Mutation', shorten: { __typename?: 'Link', id: number, link: string, hash: string, createdAt: string, updatedAt: string } };

export type LinkQueryVariables = Exact<{
  hash: Scalars['String'];
}>;


export type LinkQuery = { __typename?: 'Query', link: { __typename?: 'Link', id: number, link: string, hash: string, createdAt: string, updatedAt: string } };


export const ShortenDocument = gql`
    mutation Shorten($link: String!) {
  shorten(link: $link) {
    id
    link
    hash
    createdAt
    updatedAt
  }
}
    `;

export function useShortenMutation() {
  return Urql.useMutation<ShortenMutation, ShortenMutationVariables>(ShortenDocument);
};
export const LinkDocument = gql`
    query Link($hash: String!) {
  link(hash: $hash) {
    id
    link
    hash
    createdAt
    updatedAt
  }
}
    `;

export function useLinkQuery(options: Omit<Urql.UseQueryArgs<LinkQueryVariables>, 'query'>) {
  return Urql.useQuery<LinkQuery>({ query: LinkDocument, ...options });
};