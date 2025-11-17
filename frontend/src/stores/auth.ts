import { defineStore } from "pinia";
import { AuthService, type User, type LoginCredentials, type SignUpData } from "@/services/auth.service";
import { useProfileStore } from "./profile";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  }),

  getters: {
    hasUser: (state) => !!state.user,
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.isLoading = true;
      this.error = null;

      try {
        const authService = new AuthService();
        await authService.login(credentials);
        await this.fetchUser();
      } catch (error: any) {
        const errorMessage = error.response?.data?.error?.message 
          || error.response?.data?.message
          || error.message
          || "Логин и/или пароль неверны";
        this.error = errorMessage;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async signUp(data: SignUpData) {
      this.isLoading = true;
      this.error = null;

      try {
        const authService = new AuthService();
        const user = await authService.signUp(data);
        await this.login({ email: data.email, password: data.password });
        return user;
      } catch (error: any) {
        const errorMessage = error.response?.data?.error?.message 
          || error.response?.data?.message
          || error.message
          || "Ошибка при регистрации";
        this.error = errorMessage;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchUser() {
      const authService = new AuthService();
      
      if (!authService.isAuthenticated()) {
        this.user = null;
        this.isAuthenticated = false;
        return;
      }

      try {
        const user = await authService.whoAmI();
        this.user = user;
        this.isAuthenticated = true;

        const profileStore = useProfileStore();
        profileStore.setProfile(user.id, user.name, user.email, user.phone, user.avatar);
      } catch (error) {
        this.logout();
      }
    },

    async logout() {
      this.isLoading = true;
      this.error = null;

      try {
        const authService = new AuthService();
        await authService.logout();
      } catch (error) {
        console.error("Ошибка при выходе:", error);
      } finally {
        this.user = null;
        this.isAuthenticated = false;
        localStorage.removeItem("token");

        const profileStore = useProfileStore();
        profileStore.clearProfile();

        this.isLoading = false;
      }
    },

    checkAuth() {
      const authService = new AuthService();
      this.isAuthenticated = authService.isAuthenticated();
      
      if (this.isAuthenticated && !this.user) {
        this.fetchUser();
      }
    },
  },
});

