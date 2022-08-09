export const validateUsername = (username: string) => {
  // Consecutive periods, underscores, or a combination: https://stackoverflow.com/a/30317298
  const regexConsecutive = /^[._]?[a-zA-Z0-9]+([._][a-zA-Z0-9]+)*[._]?$/;

  // 0-9, A-Z, a-z, _, .: https://stackoverflow.com/a/41708149
  const regexValidChar = /^[0-9A-Za-z_.]+$/;

  if (username.length <= 2) {
    return [
      {
        field: "username",
        message: "username must at least 3 characters long",
      },
    ];
  }

  if (username.startsWith(".") || username.endsWith(".")) {
    return [
      {
        field: "username",
        message: "username can not start or end with a '.'",
      },
    ];
  }

  if (username.startsWith("_") || username.endsWith("_")) {
    return [
      {
        field: "username",
        message: "username can not start or end with a '_'",
      },
    ];
  }

  if (!regexValidChar.test(username)) {
    return [
      {
        field: "username",
        message: "username can only consist of 'a-z', '0-9', '.', or '_'",
      },
    ];
  }

  if (!regexConsecutive.test(username)) {
    return [
      {
        field: "username",
        message:
          "username can not have consecutive '_', '.', or a combination of them",
      },
    ];
  }

  return null;
};
