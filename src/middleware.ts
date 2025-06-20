import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async (
  { cookies, request, redirect },
  next,
) => {
  const token = cookies.get("access_token");

  const url = new URL(request.url);
  const path = url.pathname;

  const isProtectedRoute = path.startsWith("/home");
  const isAuthRoute = path === "/login" || path === "/register" || path === "/";

  if (isProtectedRoute && !token) {
    return redirect("/login");
  }

  if (isAuthRoute && token) {
    return redirect("/home");
  }
  return next();
};
