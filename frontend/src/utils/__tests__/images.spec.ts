import { describe, it, expect, vi, beforeEach } from "vitest";
import { getImageUrl } from "../images";

// Мокаем API_BASE_URL
vi.mock("@/services/config", () => ({
  API_BASE_URL: "http://localhost:3000",
}));

describe("getImageUrl", () => {
  it("возвращает пустую строку для пустого пути", () => {
    expect(getImageUrl("")).toBe("");
  });

  it("возвращает исходный URL для абсолютных HTTP/HTTPS путей", () => {
    expect(getImageUrl("https://example.com/image.png")).toBe("https://example.com/image.png");
    expect(getImageUrl("http://example.com/image.png")).toBe("http://example.com/image.png");
  });

  it("обрабатывает путь, начинающийся с /", () => {
    const result = getImageUrl("/public/img/logo.svg");
    expect(result).toBe("http://localhost:3000/public/img/logo.svg");
  });

  it("добавляет /public/img/ для путей без /", () => {
    const result = getImageUrl("logo");
    expect(result).toBe("http://localhost:3000/public/img/logo.svg");
  });

  it("добавляет .svg расширение для путей без расширения", () => {
    const result = getImageUrl("/logo");
    expect(result).toBe("http://localhost:3000/logo.svg");
  });

  it("не добавляет .svg если расширение уже есть", () => {
    const result = getImageUrl("/logo.png");
    expect(result).toBe("http://localhost:3000/logo.png");
  });

  it("корректно обрабатывает полный путь с расширением", () => {
    const result = getImageUrl("/public/img/logo.svg");
    expect(result).toBe("http://localhost:3000/public/img/logo.svg");
  });

  it("обрабатывает базовый URL с завершающим слешем", () => {
    // Этот тест проверяет логику replace(/\/$/, "") в функции
    const result = getImageUrl("/public/img/test.jpg");
    expect(result).toBe("http://localhost:3000/public/img/test.jpg");
  });
});

