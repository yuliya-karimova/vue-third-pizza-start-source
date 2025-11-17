import { CrudService } from "./base/crud.service";
import type { Ingredient } from "@/types";

export class IngredientsService extends CrudService<Ingredient> {
  constructor(baseURL?: string) {
    super("ingredients", baseURL);
  }
}

