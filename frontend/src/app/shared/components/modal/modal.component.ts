import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-modal",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="isOpen"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
      (click)="onBackdropClick($event)"
    >
      <div
        class="relative bg-white rounded-xl shadow-2xl w-full max-h-[90vh] overflow-y-auto"
        [ngClass]="sizeClass"
        (click)="$event.stopPropagation()"
      >
        <div
          class="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between rounded-t-xl z-10"
        >
          <h3 class="text-lg sm:text-xl font-bold text-gray-900">
            {{ title }}
          </h3>
          <button
            (click)="close.emit()"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="p-4 sm:p-6">
          <ng-content></ng-content>
        </div>

        <div
          *ngIf="showFooter"
          class="sticky bottom-0 bg-gray-50 px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-end gap-3 rounded-b-xl border-t border-gray-200"
        >
          <ng-content select="[footer]"></ng-content>
        </div>
      </div>
    </div>
  `,
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = "";
  @Input() size: "sm" | "md" | "lg" | "xl" = "md";
  @Input() showFooter = true;
  @Output() close = new EventEmitter<void>();

  get sizeClass(): string {
    const sizes = {
      sm: "max-w-md",
      md: "max-w-2xl",
      lg: "max-w-4xl",
      xl: "max-w-6xl",
    };
    return sizes[this.size];
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
