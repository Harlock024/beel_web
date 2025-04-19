import { API_URL } from "./api_url";

export async function RefreshToken() {
  return fetch(API_URL + "/refresh", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
    body: JSON.stringify({
      refresh_token: localStorage.getItem("refresh_token"),
    }),
  })
    .then((response) => response.json())
    .then((data) => data);
}
