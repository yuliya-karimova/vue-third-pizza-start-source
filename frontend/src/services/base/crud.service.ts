import { HttpService } from "./http.service";

export interface CreateDto {
  [key: string]: any;
}

export interface UpdateDto {
  [key: string]: any;
}

export class CrudService<T, CreateT = CreateDto, UpdateT = UpdateDto> extends HttpService {
  protected resource: string;

  constructor(resource: string, baseURL?: string) {
    super(baseURL);
    this.resource = resource;
  }

  async findAll(): Promise<T[]> {
    return this.get<T[]>(`/${this.resource}`);
  }

  async findOne(id: number | string): Promise<T> {
    return this.get<T>(`/${this.resource}/${id}`);
  }

  async create(data: CreateT): Promise<T> {
    return this.post<T>(`/${this.resource}`, data);
  }

  async update(id: number | string, data: UpdateT): Promise<T> {
    return this.patch<T>(`/${this.resource}/${id}`, data);
  }

  async replace(id: number | string, data: UpdateT): Promise<void> {
    return this.put<void>(`/${this.resource}/${id}`, data);
  }

  async remove(id: number | string): Promise<void> {
    return this.delete<void>(`/${this.resource}/${id}`);
  }
}

