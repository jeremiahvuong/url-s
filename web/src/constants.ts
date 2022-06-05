export const __prod__ = process.env.NODE_ENV === "production";
export const DOMAIN_NAME = __prod__
  ? "http://testdomain.com/"
  : "http://localhost:3000/";
