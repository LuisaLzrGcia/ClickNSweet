import { getCurrentUser } from "../login/auth.js";

export function protectRoutesByRole() {
    const user = getCurrentUser();

    const role = user?.role || "user";

    const allowedRoutes = {
        admin: ["main-manage-products.html", "edit-product.html", "new-product.html"],
        user: ["about.html",
            "cart.html",
            "contact-us.html",
            "faq.html",
            "form.html",
            "help-center.html",
            "index.html",
            "login.html",
            "our-story.html",
            "payment.html",
            "privacy.html",
            "product-detail.html",
            "products.html",
            "prueba.html",
            "register.html",
            "terms-conditions.html"],
    };

    const homePageByRole = {
        admin: "/main-manage-products.html",
        user: "/index.html"
    }

    const currentPath = window.location.pathname.split("/").pop();

    const isAllowed = allowedRoutes[role].includes(currentPath);

    if (!isAllowed) {
        window.location.replace(homePageByRole[role]);
    }
}

