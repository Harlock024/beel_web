import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async (
  { cookies, request, redirect },
  next,
) => {
  const token = cookies.get("access_token");

  const isProtectedRoute = request.url.includes("/home");

  if (isProtectedRoute && !token) {
    return redirect("/login");
  }
  return next();
};
