import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-search-input",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative w-full">
      <input
        type="text"
        [(ngModel)]="value"
        (ngModelChange)="valueChange.emit($event)"
        (keyup.enter)="search.emit(value)"
        [placeholder]="placeholder"
        class="w-full pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
      />
      <svg
        class="absolute left-3 top-2 sm:top-2.5 h-5 w-5 text-gray-400 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  `,
})
export class SearchInputComponent {
  @Input() value = "";
  @Input() placeholder = "Buscar...";
  @Output() valueChange = new EventEmitter<string>();
  @Output() search = new EventEmitter<string>();
}
