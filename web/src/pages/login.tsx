import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import Head from "next/head";
import { createUrqlClient } from "../utils/createUrqlClient";

const Login: NextPage = () => {
  return (
    <>
      <Head>
        <title>Login in to urldabra</title>
      </Head>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
