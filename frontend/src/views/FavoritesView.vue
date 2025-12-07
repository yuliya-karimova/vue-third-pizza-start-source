<template>
  <main class="layout">
    <div class="layout__sidebar sidebar">
      <router-link
        to="/orders"
        :class="[
          'layout__link',
          { 'layout__link--active': $route.path === '/orders' },
        ]"
        >История заказов</router-link
      >
      <router-link
        to="/profile"
        :class="[
          'layout__link',
          { 'layout__link--active': $route.path === '/profile' },
        ]"
        >Мои данные</router-link
      >
      <router-link
        to="/favorites"
        :class="[
          'layout__link',
          { 'layout__link--active': $route.path === '/favorites' },
        ]"
        >Избранные пиццы</router-link
      >
    </div>

    <div class="layout__content">
      <div class="layout__title">
        <h1 class="title title--big">Избранные пиццы</h1>
      </div>

      <LoadingSpinner
        v-if="favoritesStore.isLoading"
        :visible="favoritesStore.isLoading"
        size="large"
        message="Загрузка избранных..."
        overlay
      />

      <div
        v-if="
          !favoritesStore.isLoading &&
          favoritesStore.favoritePizzas.length === 0
        "
        class="layout__empty"
      >
        У вас пока нет избранных пицц
        <p class="layout__empty-hint">
          Создайте пиццу в конструкторе и сохраните её в избранное
        </p>
      </div>

      <TransitionGroup v-else name="fade-in-up" tag="div">
        <section
          v-for="favorite in favoritesStore.favoritePizzas"
          :key="favorite.id"
          class="sheet favorite-pizza"
        >
          <div class="favorite-pizza__header">
            <div class="favorite-pizza__info">
              <h2 class="favorite-pizza__name">{{ favorite.name }}</h2>
              <p v-if="favorite.createdAt" class="favorite-pizza__date">
                Сохранено: {{ formatDate(favorite.createdAt) }}
              </p>
            </div>
            <div class="favorite-pizza__actions">
              <button
                type="button"
                class="button button--border"
                @click="loadToConstructor(favorite)"
              >
                Открыть в конструкторе
              </button>
              <button
                type="button"
                class="button button--transparent"
                @click="deleteFavorite(favorite.id!)"
              >
                Удалить
              </button>
            </div>
          </div>

          <div class="favorite-pizza__content">
            <div class="favorite-pizza__preview">
              <div
                :class="`pizza pizza--foundation--${getPizzaSizeKey(favorite)}-${getPizzaSauceKey(favorite)}`"
              >
                <div class="pizza__wrapper">
                  <div
                    v-for="(ingredient, index) in getPizzaIngredientsKeys(
                      favorite,
                    )"
                    :key="`${ingredient.key}-${index}`"
                    :class="[
                      'pizza__filling',
                      `pizza__filling--${ingredient.key}`,
                      ingredient.count === 2 ? 'pizza__filling--second' : '',
                      ingredient.count === 3 ? 'pizza__filling--third' : '',
                    ]"
                  />
                </div>
              </div>
            </div>

            <div class="favorite-pizza__details">
              <div class="favorite-pizza__detail">
                <span class="favorite-pizza__label">Размер:</span>
                <span>{{ favorite.size?.name || "Не указан" }}</span>
              </div>
              <div class="favorite-pizza__detail">
                <span class="favorite-pizza__label">Тесто:</span>
                <span>{{ favorite.dough?.name || "Не указано" }}</span>
              </div>
              <div class="favorite-pizza__detail">
                <span class="favorite-pizza__label">Соус:</span>
                <span>{{ favorite.sauce?.name || "Не указан" }}</span>
              </div>
              <div class="favorite-pizza__detail">
                <span class="favorite-pizza__label">Ингредиенты:</span>
                <span>{{ getIngredientsList(favorite) }}</span>
              </div>
            </div>
          </div>
        </section>
      </TransitionGroup>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useFavoritesStore } from "@/stores/favorites";
import { usePizzaStore } from "@/stores/pizza";
import { useDataStore } from "@/stores/data";
import { useToast } from "@/composables/useToast";
import { useModal } from "@/composables/useModal";
import { LoadingSpinner } from "@/common/components/loading-spinner";
import type { FavoritePizza } from "@/services";

const router = useRouter();
const favoritesStore = useFavoritesStore();
const pizzaStore = usePizzaStore();
const dataStore = useDataStore();
const toast = useToast();
const modal = useModal();

onMounted(async () => {
  await favoritesStore.loadFavorites();
});

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getPizzaSizeKey = (favorite: FavoritePizza): string => {
  return favorite.size?.key || "";
};

const getPizzaSauceKey = (favorite: FavoritePizza): string => {
  return favorite.sauce?.key || "";
};

const getPizzaIngredientsKeys = (
  favorite: FavoritePizza,
): Array<{ key: string; count: number }> => {
  const ingredients: Array<{ key: string; count: number }> = [];
  if (favorite.ingredients && favorite.ingredients.length > 0) {
    favorite.ingredients.forEach((ing) => {
      const ingredient = dataStore.getIngredientById(ing.ingredientId);
      const key = ingredient?.key;
      if (key && ing.quantity > 0) {
        ingredients.push({ key, count: ing.quantity });
      }
    });
  }
  return ingredients;
};

const getIngredientsList = (favorite: FavoritePizza): string => {
  if (!favorite.ingredients || favorite.ingredients.length === 0) {
    return "Нет ингредиентов";
  }

  const names = favorite.ingredients
    .map((ing) => {
      const ingredient = dataStore.getIngredientById(ing.ingredientId);
      if (!ingredient) return "";
      const name = ingredient.name.toLowerCase();
      return ing.quantity > 1 ? `${name} ×${ing.quantity}` : name;
    })
    .filter(Boolean);

  return names.join(", ") || "Нет ингредиентов";
};

const loadToConstructor = (favorite: FavoritePizza) => {
  // Загружаем данные пиццы в конструктор
  if (favorite.size) {
    const size = dataStore.getSizeById(favorite.sizeId);
    if (size) pizzaStore.setSize(size);
  }

  if (favorite.dough) {
    const dough = dataStore.getDoughById(favorite.doughId);
    if (dough) pizzaStore.setDough(dough);
  }

  if (favorite.sauce) {
    const sauce = dataStore.getSauceById(favorite.sauceId);
    if (sauce) pizzaStore.setSauce(sauce);
  }

  pizzaStore.setPizzaName(favorite.name);

  // Загружаем ингредиенты
  if (favorite.ingredients && favorite.ingredients.length > 0) {
    const ingredients: Record<number, { count: number; price: number }> = {};
    favorite.ingredients.forEach((ing) => {
      const ingredient = dataStore.getIngredientById(ing.ingredientId);
      if (ingredient) {
        ingredients[ing.ingredientId] = {
          count: ing.quantity,
          price: ingredient.price,
        };
      }
    });
    pizzaStore.selectedIngredients = ingredients;
  }

  // Переходим на главную страницу
  router.push("/");
};

const deleteFavorite = async (id: number) => {
  const confirmed = await modal.show({
    title: "Удаление из избранного",
    message: `Вы уверены, что хотите удалить пиццу "${favoritesStore.getFavoriteById(id)?.name}" из избранного?`,
    confirmText: "Удалить",
    cancelText: "Отмена",
    isDanger: true,
  });

  if (!confirmed) {
    return;
  }

  try {
    await favoritesStore.removeFavorite(id);
    toast.success("Пицца удалена из избранного");
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message ||
      "Ошибка при удалении из избранного";
    toast.error(errorMessage);
  }
};
</script>

<style lang="scss">
@use "@/assets/scss/blocks/title";
@use "@/assets/scss/blocks/button";
@use "@/assets/scss/blocks/pizza";
@use "@/assets/scss/layout/layout";
@use "@/assets/scss/layout/sidebar";

.favorite-pizza {
  margin-bottom: 20px;
}

.favorite-pizza__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 20px;
}

.favorite-pizza__info {
  flex: 1;
}

.favorite-pizza__name {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: bold;
}

.favorite-pizza__date {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.favorite-pizza__actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.favorite-pizza__content {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.favorite-pizza__preview {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
}

.favorite-pizza__details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.favorite-pizza__detail {
  display: flex;
  gap: 8px;
}

.favorite-pizza__label {
  font-weight: bold;
  min-width: 120px;
}

.layout__empty-hint {
  margin-top: 12px;
  color: #666;
  font-size: 14px;
}

@media (max-width: 768px) {
  .favorite-pizza__header {
    flex-direction: column;
  }

  .favorite-pizza__actions {
    width: 100%;
    flex-direction: column;
  }

  .favorite-pizza__content {
    flex-direction: column;
  }

  .favorite-pizza__preview {
    width: 100%;
    max-width: 200px;
    margin: 0 auto;
  }
}
</style>
