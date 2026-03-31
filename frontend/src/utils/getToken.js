import { auth } from "../firebase";

export const getToken = async () => {
  const user = auth.currentUser;

  if (!user) {
    console.log("No user logged in");
    return null;
  }

  const token = await user.getIdToken();
  return token;
};