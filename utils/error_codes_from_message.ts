export const error_code_from_message = (message: string) => {
  if (message.toLowerCase().includes("unauthorized access")) {
    return 401;
  } else if (message.toLowerCase().includes("forbidden")) {
    return 403;
  } else {
    return 400;
  }
};
