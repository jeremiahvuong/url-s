import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import NextLink from "next/link";
import styles from "../styles/Home.module.css";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data: meData, fetching }] = useMeQuery({
    pause: isServer(),
  });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  let userState = null;

  // data loading
  if (fetching) {
    // wait for fetch
  } else if (!meData?.me) {
    // user not logged in
    userState = (
      <>
        <NextLink href="/login">
          <button className={styles.button}>Login</button>
        </NextLink>
        <NextLink href="register">
          <button className={styles.button}>Register</button>
        </NextLink>
      </>
    );
  } else {
    // user is logged in
    userState = (
      <>
        <p className={styles.username}>{meData.me.username}</p>
        <button
          className={styles.button}
          onClick={() => {
            logout();
          }}
          disabled={logoutFetching}
        >
          Logout
        </button>
      </>
    );
  }

  return <div className={styles.header}>{userState}</div>;
};

export default NavBar;
