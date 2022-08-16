import { Button, Flex, Link, Spacer, useDisclosure } from "@chakra-ui/react";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import Head from "next/head";
import EditModal from "../components/editModal";
import { Layout } from "../components/Layout";
import { DOMAIN_NAME } from "../constants";
import { useDeleteMutation, useMyLinksQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Manage: NextPage = () => {
  const [{ data, fetching, error }] = useMyLinksQuery();
  const [, deleteData] = useDeleteMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!fetching && !data) {
    return (
      <div>
        <div>oops...</div>
        <div>{error?.message}</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>urldabra</title>
        <meta name="description" content="A URL shortening web-app." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <EditModal onClose={onClose} onOpen={onOpen} isOpen={isOpen} />

      <Layout>
        {!data && fetching ? (
          <p>loading...</p>
        ) : (
          data?.myLinks
            ?.slice(0)
            .reverse()
            .map((p) => (
              <Flex p={2} key={p.id}>
                <Link href={p.link}>{p.link}</Link>
                <Spacer />
                <Link href={DOMAIN_NAME + p.hash}>{DOMAIN_NAME + p.hash}</Link>
                <Button ml={2} onClick={onOpen}>
                  ✏️
                </Button>
                <Button
                  ml={2}
                  onClick={() => {
                    deleteData({ id: p.id });
                  }}
                >
                  🗑️
                </Button>
              </Flex>
            ))
        )}
      </Layout>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Manage);
