export const validateEmail = (email: string) => {
  // Email regex: https://stackoverflow.com/a/9204568
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!regexEmail.test(email)) {
    return [
      {
        field: "email",
        message: "invalid email",
      },
    ];
  }

  return null;
};
