export const setCSRFToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("csrf", token);
  }
};

export const getCSRFToken = () => {
  let token: string | null = "";
  if (typeof window !== "undefined") {
    token = localStorage.getItem("csrf");
  }

  return token;
};

export const setUserInfo = ({
  userId,
  username,
}: {
  userId: number;
  username: string;
}) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("userid", userId.toString());
    localStorage.setItem("username", username);
  }
};

export const getUserId = () => {
  let userId: string | null = "";
  if (typeof window !== "undefined") {
    userId = localStorage.getItem("userid");
  }

  return userId;
};

export const getUsername = () => {
  let username: string | null = "";
  if (typeof window !== "undefined") {
    username = localStorage.getItem("username");
  }

  return username;
};

export const removeAllToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("csrf");
    localStorage.removeItem("userid");
    localStorage.removeItem("username");
  }
};