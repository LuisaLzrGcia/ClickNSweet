import { getCurrentUser } from "../login/auth.js";

const currentPath = window.location.pathname.split("/").pop();
const isInLoginPage = currentPath.includes("login");

export function preventLoginIfAuthenticated() {
  const currentUser = getCurrentUser();
  if (currentUser && isInLoginPage) {
    window.location.href = "/"
  } 
}
