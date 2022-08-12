import dynamic from "next/dynamic";
import React from "react";
import Wrapper, { WrapperVariant } from "./Wrapper";

const NavBar = dynamic(() => import("../components/NavBar"), { ssr: false });

interface LayoutProps {
  children: any;
  variant?: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  return (
    <>
      <NavBar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};
