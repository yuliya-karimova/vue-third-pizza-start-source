import { logger } from "./logger";

/**
 * Анимация полета элемента к корзине
 */
export function flyToCart(
  fromElement: HTMLElement,
  toSelector: string = ".header__cart a",
  options: {
    duration?: number;
    imageUrl?: string;
    onComplete?: () => void;
  } = {}
) {
  const {
    duration = 800,
    imageUrl,
    onComplete,
  } = options;

  // Получаем координаты начальной точки (кнопки)
  const fromRect = fromElement.getBoundingClientRect();
  const fromX = fromRect.left + fromRect.width / 2;
  const fromY = fromRect.top + fromRect.height / 2;

  // Получаем координаты конечной точки (корзина)
  const toElement = document.querySelector(toSelector) as HTMLElement;
  if (!toElement) {
    logger.warn("Элемент корзины не найден");
    if (onComplete) onComplete();
    return;
  }

  const toRect = toElement.getBoundingClientRect();
  const toX = toRect.left + toRect.width / 2;
  const toY = toRect.top + toRect.height / 2;

  // Создаем летящий элемент
  const flyingElement = document.createElement("div");
  flyingElement.className = "flying-pizza";
  flyingElement.style.cssText = `
    position: fixed;
    left: ${fromX}px;
    top: ${fromY}px;
    width: 60px;
    height: 60px;
    z-index: 9999;
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
    opacity: 1;
  `;

  // Функция для создания fallback элемента
  function createFallbackElement() {
    flyingElement.innerHTML = `
      <div style="
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%);
        border-radius: 50%;
        border: 3px solid #fff;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 24px;
      ">🍕</div>
    `;
  }

  // Сначала пытаемся найти существующее изображение на странице для получения правильного пути
  const existingImg = document.querySelector(".product__img") as HTMLImageElement;
  let finalImageUrl = existingImg?.src || imageUrl;
  
  // Создаем изображение пиццы
  const img = document.createElement("img");
  
  function setupImage() {
    if (!finalImageUrl) {
      createFallbackElement();
      document.body.appendChild(flyingElement);
      startAnimation();
      return;
    }
    
    img.src = finalImageUrl;
    img.alt = "Пицца";
    img.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    `;
    
    // Проверяем, загружено ли изображение
    if (img.complete && img.naturalWidth > 0) {
      // Изображение уже загружено
      flyingElement.appendChild(img);
      document.body.appendChild(flyingElement);
      startAnimation();
    } else {
      // Ждем загрузки изображения
      img.onload = () => {
        document.body.appendChild(flyingElement);
        startAnimation();
      };
      
      // Обработка ошибки загрузки изображения
      img.onerror = () => {
        logger.warn("Не удалось загрузить изображение, используем fallback");
        flyingElement.innerHTML = "";
        createFallbackElement();
        document.body.appendChild(flyingElement);
        startAnimation();
      };
      
      flyingElement.appendChild(img);
      document.body.appendChild(flyingElement);
    }
  }

  // Если есть существующее изображение, сразу используем его
  if (finalImageUrl) {
    setupImage();
  } else {
    // Если изображение не найдено, используем fallback
    createFallbackElement();
    document.body.appendChild(flyingElement);
    startAnimation();
  }

  function startAnimation() {

    // Принудительный reflow для запуска анимации
    flyingElement.offsetHeight;

    // Запускаем анимацию с дугообразной траекторией
    requestAnimationFrame(() => {
    const deltaX = toX - fromX;
    const deltaY = toY - fromY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Создаем keyframes для дугообразной траектории
    const keyframes = [
      {
        transform: `translate(-50%, -50%) scale(1) rotate(0deg)`,
        opacity: 1,
        offset: 0,
      },
      {
        transform: `translate(${deltaX * 0.5}px, ${deltaY * 0.5 - Math.min(distance / 3, 150)}px) translate(-50%, -50%) scale(0.7) rotate(180deg)`,
        opacity: 0.9,
        offset: 0.5,
      },
      {
        transform: `translate(${deltaX}px, ${deltaY}px) translate(-50%, -50%) scale(0.3) rotate(360deg)`,
        opacity: 0.6,
        offset: 1,
      },
    ];

    // Используем Web Animations API для более плавной анимации
    const animation = flyingElement.animate(keyframes, {
      duration: duration,
      easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      fill: "forwards",
    });

    animation.onfinish = () => {
      if (flyingElement.parentNode) {
        flyingElement.parentNode.removeChild(flyingElement);
      }
      if (onComplete) {
        onComplete();
      }
    };
  });
}}
