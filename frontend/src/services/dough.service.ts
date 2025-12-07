import { CrudService } from "./base/crud.service";
import type { Dough } from "@/types";

export class DoughService extends CrudService<Dough> {
  constructor(baseURL?: string) {
    super("dough", baseURL);
  }
}

