import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  document?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientsResponse {
  data: Client[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateClientDto {
  name: string;
  email: string;
  phone?: string;
  document?: string;
  address?: string;
}

export interface UpdateClientDto {
  name?: string;
  email?: string;
  phone?: string;
  document?: string;
  address?: string;
}

@Injectable({
  providedIn: "root",
})
export class ClientsService {
  private apiUrl = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) {}

  getClients(
    search?: string,
    page: number = 1,
    limit: number = 10
  ): Observable<ClientsResponse> {
    let url = `${this.apiUrl}?page=${page}&limit=${limit}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    return this.http.get<ClientsResponse>(url);
  }

  getClient(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  createClient(client: CreateClientDto): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  updateClient(id: string, client: UpdateClientDto): Observable<Client> {
    return this.http.patch<Client>(`${this.apiUrl}/${id}`, client);
  }

  deleteClient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
