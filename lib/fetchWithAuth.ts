const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function refreshToken() {
  const token = localStorage.getItem("refreshToken");

  const res = await fetch(`${API_BASE}/users/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: token }),
  });

  if (!res.ok) throw new Error("Failed to refresh token");

  const data = await res.json();

  console.log(data)

  localStorage.setItem("accessToken", data.accessToken);

  return data.accessToken;
}

export async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem("accessToken");
  console.log("oo", token)

  const authInit = {
    ...init,
    headers: {
      ...(init.headers || {}),
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  console.log(input, authInit)
  let res = await fetch(input, authInit);

  console.log("bll ",res)

  if (res.status === 401) {
    try {
      const newToken = await refreshToken();

      const retryInit = {
        ...init,
        headers: {
          ...(init.headers || {}),
          "Content-Type": "application/json",
          Authorization: `Bearer ${newToken}`,
        },
      };

      res = await fetch(input, retryInit);
    } catch (err) {
      console.error("Refresh token failed", err);
      // Optionally logout user
      localStorage.clear();
      //window.location.href = "/";
      throw err;
    }
  }

  return res;
}
