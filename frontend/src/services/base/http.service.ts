import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

export class HttpService {
  protected client: AxiosInstance;

  constructor(baseURL: string = "http://localhost:3000") {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        return this.handleError(error);
      }
    );
  }

  protected getToken(): string | null {
    return localStorage.getItem("token");
  }

  protected handleError(error: AxiosError): Promise<never> {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          this.handleUnauthorized();
          break;
        case 403:
          console.error("Доступ запрещен");
          break;
        case 404:
          console.error("Ресурс не найден");
          break;
        case 500:
          console.error("Ошибка сервера");
          break;
        default:
          console.error("Произошла ошибка:", data);
      }
    } else if (error.request) {
      console.error("Ошибка сети. Проверьте подключение к серверу");
    } else {
      console.error("Ошибка:", error.message);
    }

    return Promise.reject(error);
  }

  protected handleUnauthorized(): void {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }
}

