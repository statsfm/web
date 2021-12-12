import api from "~/api";
import router from "~/router";
import store from "~/store";

export interface Response {
  success: boolean;
  status: number;
  statusText: string;
  url: string;
  headers: any;
  data: any;
}

export default class auth {
  private readonly clientId: string = "10a0c86a444b4e7bad722e9d08da0be6";
  private readonly redirectUri: string = `${location.origin}/auth/spotify/callback`;
  private readonly api = api;
  private readonly store = store;

  constructor() {
    this.init();
  }

  public init = () => {
    if (this.isLoggedIn()) {
      const user = JSON.parse(localStorage.getItem("user") as string);
      this.store.commit("setUser", user);
    }
  };

  public login = (redirectPage?: string) => {
    const loginUrl = `https://accounts.spotify.com/authorize?client_id=${
      this.clientId
    }&redirect_uri=${encodeURIComponent(
      this.redirectUri
    )}&scope=user-read-private&response_type=code&response_mode=query&state=${Date.now()}`;

    localStorage.setItem(
      "redirectPage",
      redirectPage == "string" ? redirectPage : location.pathname
    );

    location.replace(loginUrl);
  };

  public logout = () => {
    localStorage.removeItem("token");
    location.reload();
  };

  public exchangeSpotifyToken = async (code: string) => {
    const res = await this.api.post("/auth/token", {
      body: JSON.stringify({
        code,
        client_id: this.clientId,
        redirect_uri: this.redirectUri,
      }),
    });

    const data = res.data.data;

    if (data.apiToken?.length > 10 && data.user) {
      this.store.commit("setUser", data.user);

      localStorage.setItem("token", data.apiToken);
    }

    let page = localStorage.getItem("redirectPage") ?? "/";

    if (page.startsWith("/auth")) {
      page = "/";
    }

    router.push(page);
  };

  public isLoggedIn = () => {
    if (!this.hasValidToken()) return false;
    const user = localStorage.getItem("user");

    return user != null && user != undefined;
  };

  public hasValidToken = () => {
    const token = localStorage.getItem("token");
    if (token?.startsWith("ey")) {
      const expiry = JSON.parse(atob(token.split(".")[1])).exp; // falsely marked as deprecated -> https://github.com/microsoft/TypeScript/issues/45566

      return Math.floor(new Date().getTime() / 1000) <= expiry;
    }

    return false;
  };
}
