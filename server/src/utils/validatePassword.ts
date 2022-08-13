export const validatePassword = (password: string) => {
  if (password.length <= 2) {
    return [
      {
        field: "password",
        message: "password must be at least 3 characters long",
      },
    ];
  }

  return null;
};
