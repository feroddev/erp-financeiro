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
        <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
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
      *ngIf="showPagination && totalPages > 1"
      class="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-0"
    >
      <div class="text-sm text-gray-700 text-center sm:text-left">
        Página <span class="font-medium">{{ currentPage }}</span> de
        <span class="font-medium">{{ totalPages }}</span>
        <span class="hidden sm:inline ml-2"
          >({{ total }} {{ itemName }} no total)</span
        >
      </div>
      <div class="flex gap-2">
        <button
          (click)="previousPage.emit()"
          [disabled]="currentPage === 1"
          class="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span class="hidden sm:inline">Anterior</span>
          <span class="sm:hidden">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </span>
        </button>
        <button
          (click)="nextPage.emit()"
          [disabled]="currentPage === totalPages"
          class="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span class="hidden sm:inline">Próxima</span>
          <span class="sm:hidden">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </button>
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
  @Input() itemName = "itens";
  @Output() previousPage = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();
}
