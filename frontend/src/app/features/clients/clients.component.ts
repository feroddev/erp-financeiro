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
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { TableComponent, TableColumn } from '../../shared/components/table/table.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { HeaderComponent } from '../../shared/components/header/header.component';

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
    HeaderComponent,
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
  limit = 10;

  showModal = false;
  modalMode: "create" | "edit" = "create";
  selectedClient: Client | null = null;

  showDeleteModal = false;
  clientToDelete: Client | null = null;

  formErrors = {
    name: "",
    email: "",
    phone: "",
    document: ""
  };

  clientForm: CreateClientDto = {
    name: "",
    email: "",
    phone: "",
    document: "",
    address: "",
  };

  tableColumns: TableColumn[] = [
    { key: "name", label: "Nome", class: "" },
    { key: "email", label: "Email", class: "hidden sm:table-cell" },
    { key: "phone", label: "Telefone", class: "hidden md:table-cell" },
    { key: "document", label: "Documento", class: "hidden lg:table-cell" },
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
      .getClients(this.searchTerm, this.currentPage, this.limit)
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

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadClients();
    }
  }

  changeLimit(newLimit: number): void {
    this.limit = newLimit;
    this.currentPage = 1;
    this.loadClients();
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
    
    const phoneNumbers = client.phone?.replace(/\D/g, "") || "";
    const docNumbers = client.document?.replace(/\D/g, "") || "";
    
    let formattedPhone = "";
    if (phoneNumbers.length > 0) {
      if (phoneNumbers.length <= 10) {
        formattedPhone = phoneNumbers.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
      } else {
        formattedPhone = phoneNumbers.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
      }
    }
    
    let formattedDoc = "";
    if (docNumbers.length > 0) {
      if (docNumbers.length <= 11) {
        formattedDoc = docNumbers.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
      } else {
        formattedDoc = docNumbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, "$1.$2.$3/$4-$5");
      }
    }
    
    this.clientForm = {
      name: client.name,
      email: client.email,
      phone: formattedPhone,
      document: formattedDoc,
      address: client.address || "",
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedClient = null;
    this.error = "";
    this.formErrors = {
      name: "",
      email: "",
      phone: "",
      document: ""
    };
  }

  saveClient(): void {
    this.error = "";

    const clientData = {
      ...this.clientForm,
      phone: this.clientForm.phone?.replace(/\D/g, "") || "",
      document: this.clientForm.document?.replace(/\D/g, "") || ""
    };

    if (this.modalMode === "create") {
      this.clientsService.createClient(clientData).subscribe({
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
          .updateClient(this.selectedClient.id, clientData)
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

  openDeleteModal(client: Client): void {
    this.clientToDelete = client;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.clientToDelete = null;
  }

  confirmDelete(): void {
    if (this.clientToDelete) {
      this.clientsService.deleteClient(this.clientToDelete.id).subscribe({
        next: () => {
          this.closeDeleteModal();
          this.loadClients();
        },
        error: (err) => {
          this.error = "Erro ao excluir cliente";
          console.error("Erro:", err);
          this.closeDeleteModal();
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(["/dashboard"]);
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, "");
    
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    
    if (value.length <= 10) {
      value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else {
      value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }
    
    this.clientForm.phone = value;
    this.validatePhone();
  }

  onDocumentInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, "");
    
    if (value.length > 14) {
      value = value.substring(0, 14);
    }
    
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
    } else {
      value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, "$1.$2.$3/$4-$5");
    }
    
    this.clientForm.document = value;
    this.validateDocument();
  }

  validateEmail(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.clientForm.email && !emailRegex.test(this.clientForm.email)) {
      this.formErrors.email = "Email inválido";
    } else {
      this.formErrors.email = "";
    }
  }

  validatePhone(): void {
    const phoneNumbers = this.clientForm.phone?.replace(/\D/g, "") || "";
    if (this.clientForm.phone && phoneNumbers.length > 0 && phoneNumbers.length < 10) {
      this.formErrors.phone = "Telefone deve ter 10 ou 11 dígitos";
    } else {
      this.formErrors.phone = "";
    }
  }

  validateDocument(): void {
    const docNumbers = this.clientForm.document?.replace(/\D/g, "") || "";
    if (this.clientForm.document && docNumbers.length > 0) {
      if (docNumbers.length !== 11 && docNumbers.length !== 14) {
        this.formErrors.document = "CPF deve ter 11 dígitos ou CNPJ 14 dígitos";
      } else {
        this.formErrors.document = "";
      }
    } else {
      this.formErrors.document = "";
    }
  }

  isFormValid(): boolean {
    return (
      !!this.clientForm.name &&
      !!this.clientForm.email &&
      !this.formErrors.email &&
      !this.formErrors.phone &&
      !this.formErrors.document
    );
  }

  onlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.key;
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
    
    if (allowedKeys.includes(charCode)) {
      return true;
    }
    
    if (event.ctrlKey || event.metaKey) {
      return true;
    }
    
    if (!/^[0-9]$/.test(charCode)) {
      event.preventDefault();
      return false;
    }
    
    return true;
  }

  formatPhone(phone: string | undefined): string {
    if (!phone) return "-";
    const numbers = phone.replace(/\D/g, "");
    
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }
  }

  formatDocument(document: string | undefined): string {
    if (!document) return "-";
    const numbers = document.replace(/\D/g, "");
    
    if (numbers.length === 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else if (numbers.length === 14) {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
    
    return document;
  }
}
