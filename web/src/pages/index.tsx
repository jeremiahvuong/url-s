import { Form, Formik } from "formik";
import type { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { DOMAIN_NAME } from "../constants";
import { ShortenMutation, useShortenMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Layout } from "../components/Layout";
import { Box, Flex, Link, Spacer } from "@chakra-ui/react";
import InputField from "../components/InputField";

const Index: NextPage = () => {
  const [{ data }, shortenLink] = useShortenMutation();
  const [links, setLinks] = useState<ShortenMutation[]>([]);

  const addLink = useRef((link: ShortenMutation) => {});

  addLink.current = (link: ShortenMutation) => {
    if (links.length > 4) {
      links.pop();
    }

    setLinks((prevLinks) => [link, ...prevLinks]);
  };

  useEffect(() => {
    addLink.current(data!);
  }, [addLink, data]);

  return (
    <>
      <Head>
        <title>urldabra</title>
        <meta name="description" content="A URL shortening web-app." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Box mt={40}>
          <Box>
            <p>
              Made with ❤️ by{" "}
              <Link color="blue" href="https://github.com/jeremiahvuong">
                jeremiah
              </Link>
            </p>
          </Box>
          <Formik
            initialValues={{ link: "" }}
            onSubmit={async (val) => {
              await shortenLink(val);
            }}
          >
            {({ handleSubmit, handleChange }) => (
              <Form onSubmit={handleSubmit}>
                <InputField name="link" onChange={handleChange} label={""} />
              </Form>
            )}
          </Formik>
          <Box>
            {links.map(
              (data) =>
                data && (
                  <Flex>
                    <Link href={data.shorten.link?.link}>
                      {data.shorten.link?.link}
                    </Link>
                    <Spacer />
                    <Link
                      color={"blue"}
                      href={DOMAIN_NAME + data.shorten.link?.hash}
                    >
                      {DOMAIN_NAME + data.shorten.link?.hash}
                    </Link>
                  </Flex>
                )
            )}
          </Box>
        </Box>
      </Layout>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
