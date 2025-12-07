import { HttpService } from "./base/http.service";
import { API_BASE_URL } from "./config";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  phone: string;
  password: string;
  avatar?: string;
}

export interface LoginResponse {
  token: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export class AuthService extends HttpService {
  constructor(baseURL: string = API_BASE_URL) {
    super(baseURL);
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await this.post<LoginResponse>("/login", credentials);
    if (response.token) {
      localStorage.setItem("token", response.token);
    }
    return response;
  }

  async signUp(data: SignUpData): Promise<User> {
    return this.post<User>("/signup", data);
  }

  async whoAmI(): Promise<User> {
    return this.get<User>("/whoAmI");
  }

  async logout(): Promise<void> {
    try {
      await this.delete<void>("/logout");
    } finally {
      localStorage.removeItem("token");
    }
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

