import { CrudService } from "./base/crud.service";
import type { Sauce } from "@/types";

export class SaucesService extends CrudService<Sauce> {
  constructor(baseURL?: string) {
    super("sauces", baseURL);
  }
}

