import { getCurrentUser } from "../login/auth.js";

const currentPath = window.location.pathname.split("/").pop();
const isInLoginPage = currentPath.includes("login");

export function preventLoginIfAuthenticated() {
  const currentUser = getCurrentUser();
  if (currentUser && isInLoginPage) {
    const homePage = currentUser.role === "admin" ? "main-manage-products" : "index.html";
    window.location.href = homePage;
  }
}
