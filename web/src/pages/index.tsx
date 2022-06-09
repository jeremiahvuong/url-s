import { Formik } from "formik";
import type { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { DOMAIN_NAME } from "../constants";
import { ShortenMutation, useShortenMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
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
    <div className={styles.main}>
      <Head>
        <title>urldabra</title>
        <meta name="description" content="A URL shortening web-app." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.content}>
        <div className={styles.box}>
          <h1 className={styles.urldabra}>urldabra</h1>
          <p className={styles.love}>
            Made with ❤️ by{" "}
            <a href="https://github.com/jeremiahvuong">jeremiah</a>
          </p>
          <Formik
            initialValues={{ link: "" }}
            onSubmit={async (val) => {
              await shortenLink(val);
            }}
          >
            {({ handleSubmit, handleChange }) => (
              <form className={styles.form} onSubmit={handleSubmit}>
                <input
                  className={styles.input}
                  name="link"
                  onChange={handleChange}
                />
              </form>
            )}
          </Formik>
        </div>
        <div className={styles.results}>
          {links.map(
            (data) =>
              data && (
                <p className={styles.links}>
                  <a>{data?.shorten.link}</a>
                  <a
                    className={styles.hash}
                    href={DOMAIN_NAME + data?.shorten.hash}
                  >
                    {DOMAIN_NAME + data?.shorten.hash}
                  </a>
                </p>
              )
          )}
        </div>
      </div>
      <div className={styles.footer}>
        <a
          className={styles.copyright}
          href="https://github.com/jeremiahvuong/urldabra"
        >
          © 2022 jeremiah vuong
        </a>
      </div>
    </div>
  );
};

export default withUrqlClient(createUrqlClient)(Home);
