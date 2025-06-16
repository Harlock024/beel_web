import { API_URL } from "./api_url";

export async function RefreshToken() {
  return fetch(API_URL + "/refresh", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({
      refresh_token: localStorage.getItem("refresh_token"),
    }),
  })
    .then((response) => response.json())
    .then((data) => data);
}
