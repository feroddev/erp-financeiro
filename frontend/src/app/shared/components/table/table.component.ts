import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  class?: string;
}

@Component({
  selector: "app-table",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-x-auto -mx-4 sm:mx-0">
      <div class="inline-block min-w-full align-middle">
        <div
          class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg"
        >
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th
                  *ngFor="let column of columns"
                  scope="col"
                  class="px-3 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider"
                  [ngClass]="column.class"
                >
                  {{ column.label }}
                </th>
                <th
                  *ngIf="showActions"
                  scope="col"
                  class="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <ng-content></ng-content>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div
      *ngIf="showPagination"
      class="mt-4 sm:mt-6 flex flex-col gap-4 px-4 sm:px-0"
    >
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-sm text-gray-700 text-center sm:text-left">
          Mostrando
          <span class="font-medium">{{ getStartItem() }}</span> a
          <span class="font-medium">{{ getEndItem() }}</span> de
          <span class="font-medium">{{ total }}</span> {{ itemName }}
        </div>

        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-700">Itens por página:</label>
          <select
            [value]="limit"
            (change)="onLimitChange($event)"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          >
            <option [value]="10">10</option>
            <option [value]="25">25</option>
            <option [value]="50">50</option>
            <option [value]="100">100</option>
          </select>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex gap-2">
          <button
            (click)="onPageChange(1)"
            [disabled]="currentPage === 1"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Primeira página"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            (click)="previousPage.emit()"
            [disabled]="currentPage === 1"
            class="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span class="hidden sm:inline">Anterior</span>
            <span class="sm:hidden">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </span>
          </button>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-700">Página</span>
          <input
            type="number"
            [value]="currentPage"
            (change)="onPageInputChange($event)"
            min="1"
            [max]="totalPages"
            class="w-16 px-2 py-2 border border-gray-300 rounded-lg text-sm text-center font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <span class="text-sm text-gray-700">de {{ totalPages }}</span>
        </div>

        <div class="flex gap-2">
          <button
            (click)="nextPage.emit()"
            [disabled]="currentPage === totalPages"
            class="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span class="hidden sm:inline">Próxima</span>
            <span class="sm:hidden">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </button>
          <button
            (click)="onPageChange(totalPages)"
            [disabled]="currentPage === totalPages"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Última página"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() showActions = true;
  @Input() showPagination = true;
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() total = 0;
  @Input() limit = 10;
  @Input() itemName = "itens";
  @Output() previousPage = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() limitChange = new EventEmitter<number>();

  getStartItem(): number {
    return this.total === 0 ? 0 : (this.currentPage - 1) * this.limit + 1;
  }

  getEndItem(): number {
    const end = this.currentPage * this.limit;
    return end > this.total ? this.total : end;
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  onPageInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const page = parseInt(input.value, 10);
    if (!isNaN(page)) {
      this.onPageChange(page);
    }
  }

  onLimitChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newLimit = parseInt(select.value, 10);
    if (!isNaN(newLimit) && newLimit !== this.limit) {
      this.limitChange.emit(newLimit);
    }
  }
}
