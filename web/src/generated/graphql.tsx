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

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Link = {
  __typename?: 'Link';
  createdAt: Scalars['String'];
  creatorId: Scalars['Float'];
  hash: Scalars['String'];
  id: Scalars['Float'];
  link: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  delete: Scalars['Boolean'];
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: UserResponse;
  shorten: Link;
};


export type MutationDeleteArgs = {
  id: Scalars['Float'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationShortenArgs = {
  link: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  link?: Maybe<Link>;
  me?: Maybe<User>;
  myLinks?: Maybe<Array<Link>>;
};


export type QueryLinkArgs = {
  hash: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['Float'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UsernamePasswordInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type RegularErrorFragment = { __typename?: 'FieldError', field: string, message: string };

export type RegularLinkFragment = { __typename?: 'Link', id: number, link: string, hash: string, creatorId: number, createdAt: string, updatedAt: string };

export type RegularUserFragment = { __typename?: 'User', id: number, username: string };

export type RegularUserResponseFragment = { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string } | null };

export type DeleteMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type DeleteMutation = { __typename?: 'Mutation', delete: boolean };

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string } | null } };

export type ShortenMutationVariables = Exact<{
  link: Scalars['String'];
}>;


export type ShortenMutation = { __typename?: 'Mutation', shorten: { __typename?: 'Link', id: number, link: string, hash: string, creatorId: number, createdAt: string, updatedAt: string } };

export type LinkQueryVariables = Exact<{
  hash: Scalars['String'];
}>;


export type LinkQuery = { __typename?: 'Query', link?: { __typename?: 'Link', id: number, link: string, hash: string, creatorId: number, createdAt: string, updatedAt: string } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, username: string } | null };

export type MyLinksQueryVariables = Exact<{ [key: string]: never; }>;


export type MyLinksQuery = { __typename?: 'Query', myLinks?: Array<{ __typename?: 'Link', id: number, link: string, hash: string, creatorId: number, createdAt: string, updatedAt: string }> | null };

export const RegularLinkFragmentDoc = gql`
    fragment RegularLink on Link {
  id
  link
  hash
  creatorId
  createdAt
  updatedAt
}
    `;
export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
  errors {
    ...RegularError
  }
  user {
    ...RegularUser
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export const DeleteDocument = gql`
    mutation Delete($id: Float!) {
  delete(id: $id)
}
    `;

export function useDeleteMutation() {
  return Urql.useMutation<DeleteMutation, DeleteMutationVariables>(DeleteDocument);
};
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($options: UsernamePasswordInput!) {
  register(options: $options) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const ShortenDocument = gql`
    mutation Shorten($link: String!) {
  shorten(link: $link) {
    ...RegularLink
  }
}
    ${RegularLinkFragmentDoc}`;

export function useShortenMutation() {
  return Urql.useMutation<ShortenMutation, ShortenMutationVariables>(ShortenDocument);
};
export const LinkDocument = gql`
    query Link($hash: String!) {
  link(hash: $hash) {
    ...RegularLink
  }
}
    ${RegularLinkFragmentDoc}`;

export function useLinkQuery(options: Omit<Urql.UseQueryArgs<LinkQueryVariables>, 'query'>) {
  return Urql.useQuery<LinkQuery>({ query: LinkDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const MyLinksDocument = gql`
    query myLinks {
  myLinks {
    ...RegularLink
  }
}
    ${RegularLinkFragmentDoc}`;

export function useMyLinksQuery(options?: Omit<Urql.UseQueryArgs<MyLinksQueryVariables>, 'query'>) {
  return Urql.useQuery<MyLinksQuery>({ query: MyLinksDocument, ...options });
};