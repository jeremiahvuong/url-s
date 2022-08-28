import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data: meData, fetching }] = useMeQuery({
    pause: isServer(),
  });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  let userState = null;

  if (fetching) {
    // wait for fetch
  } else if (!meData?.me) {
    // user not logged in
    userState = (
      <>
        <NextLink href="/login">
          <Button mr={2}>Login</Button>
        </NextLink>
        <NextLink href="register">
          <Button>Register</Button>
        </NextLink>
      </>
    );
  } else {
    // user is logged in
    userState = (
      <Flex>
        <NextLink href="/">
          <Link mr={2}>{meData.me.username}</Link>
        </NextLink>
        <Button
          onClick={() => {
            logout();
          }}
          isLoading={logoutFetching}
          variant="link"
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex zIndex={1} position="sticky" top={0} bg="lightgray" p={4}>
      <NextLink href="/">
        <Link>urldabra</Link>
      </NextLink>
      <Box ml={"auto"}>{userState}</Box>
    </Flex>
  );
};

export default NavBar;
