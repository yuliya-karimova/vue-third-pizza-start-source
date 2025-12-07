import { CrudService } from "./base/crud.service";
import type { Size } from "@/types";

export class SizesService extends CrudService<Size> {
  constructor(baseURL?: string) {
    super("sizes", baseURL);
  }
}

