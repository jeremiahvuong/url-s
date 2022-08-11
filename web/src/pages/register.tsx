import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import Head from "next/head";
import { createUrqlClient } from "../utils/createUrqlClient";

const Register: NextPage = () => {
  return (
    <>
      <Head>
        <title>Register for urldabra</title>
      </Head>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
