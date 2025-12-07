import { CrudService } from "./base/crud.service";
import type { Misc } from "@/types";

export class MiscService extends CrudService<Misc> {
  constructor(baseURL?: string) {
    super("misc", baseURL);
  }
}

