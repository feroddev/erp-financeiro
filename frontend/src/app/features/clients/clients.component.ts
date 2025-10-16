import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import {
  ClientsService,
  Client,
  CreateClientDto,
  UpdateClientDto,
} from "../../core/services/clients.service";
import { ModalComponent } from "../../shared/components/modal/modal.component";
import { TableComponent, TableColumn } from "../../shared/components/table/table.component";
import { ButtonComponent } from "../../shared/components/button/button.component";
import { SearchInputComponent } from "../../shared/components/search-input/search-input.component";
import { CardComponent } from "../../shared/components/card/card.component";
import { AlertComponent } from "../../shared/components/alert/alert.component";

@Component({
  selector: "app-clients",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    TableComponent,
    ButtonComponent,
    SearchInputComponent,
    CardComponent,
    AlertComponent,
  ],
  templateUrl: "./clients.component.html",
  styleUrl: "./clients.component.css",
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  loading = false;
  error = "";
  searchTerm = "";
  currentPage = 1;
  totalPages = 1;
  total = 0;

  showModal = false;
  modalMode: "create" | "edit" = "create";
  selectedClient: Client | null = null;

  clientForm: CreateClientDto = {
    name: "",
    email: "",
    phone: "",
    document: "",
    address: "",
  };

  tableColumns: TableColumn[] = [
    { key: "name", label: "Nome" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Telefone" },
    { key: "document", label: "Documento" },
  ];

  constructor(
    private clientsService: ClientsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    this.error = "";

    this.clientsService
      .getClients(this.searchTerm, this.currentPage, 10)
      .subscribe({
        next: (response) => {
          this.clients = response.data;
          this.total = response.total;
          this.totalPages = response.totalPages;
          this.loading = false;
        },
        error: (err) => {
          this.error = "Erro ao carregar clientes";
          this.loading = false;
          console.error("Erro:", err);
        },
      });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadClients();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadClients();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadClients();
    }
  }

  openCreateModal(): void {
    this.modalMode = "create";
    this.selectedClient = null;
    this.clientForm = {
      name: "",
      email: "",
      phone: "",
      document: "",
      address: "",
    };
    this.showModal = true;
  }

  openEditModal(client: Client): void {
    this.modalMode = "edit";
    this.selectedClient = client;
    this.clientForm = {
      name: client.name,
      email: client.email,
      phone: client.phone || "",
      document: client.document || "",
      address: client.address || "",
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedClient = null;
    this.error = "";
  }

  saveClient(): void {
    this.error = "";

    if (this.modalMode === "create") {
      this.clientsService.createClient(this.clientForm).subscribe({
        next: () => {
          this.closeModal();
          this.loadClients();
        },
        error: (err) => {
          this.error =
            err.error?.message || "Erro ao criar cliente";
          console.error("Erro:", err);
        },
      });
    } else {
      if (this.selectedClient) {
        this.clientsService
          .updateClient(this.selectedClient.id, this.clientForm)
          .subscribe({
            next: () => {
              this.closeModal();
              this.loadClients();
            },
            error: (err) => {
              this.error =
                err.error?.message || "Erro ao atualizar cliente";
              console.error("Erro:", err);
            },
          });
      }
    }
  }

  deleteClient(client: Client): void {
    if (
      confirm(`Tem certeza que deseja excluir o cliente "${client.name}"?`)
    ) {
      this.clientsService.deleteClient(client.id).subscribe({
        next: () => {
          this.loadClients();
        },
        error: (err) => {
          this.error = "Erro ao excluir cliente";
          console.error("Erro:", err);
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(["/dashboard"]);
  }
}
