import { GetServerSideProps, NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useLinkByHashQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import router from "next/router";
import Head from "next/head";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { input: context.query.hash },
  };
};

interface Props {
  input: string;
}

const Hash: NextPage<Props> = ({ input }) => {
  const [{ data, fetching }] = useLinkByHashQuery({
    variables: { hash: input },
  });

  if (!data?.linkByHash && !fetching) {
    router.replace("/");
  }

  if (data?.linkByHash) {
    router.replace(data.linkByHash.link);
  }

  return (
    <>
      <Head>
        <title>Redirecting...</title>
      </Head>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Hash);
