import { CrudService } from "./base/crud.service";
import type { Address } from "@/stores/profile";

export interface CreateAddressDto {
  name: string;
  street: string;
  building: string;
  flat?: string;
  comment?: string;
  userId?: string;
}

export interface UpdateAddressDto {
  name?: string;
  street?: string;
  building?: string;
  flat?: string;
  comment?: string;
}

export class AddressesService extends CrudService<Address, CreateAddressDto, UpdateAddressDto> {
  constructor(baseURL?: string) {
    super("addresses", baseURL);
  }
}

