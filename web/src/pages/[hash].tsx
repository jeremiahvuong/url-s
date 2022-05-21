import { GetServerSideProps, NextPage } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { input: context.query.hash },
  };
};

interface Props {
  input: string;
}

const Hash: NextPage<Props> = ({ input }) => {
  return <>{input}</>;
};

export default Hash;
