import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-button",
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      (click)="handleClick($event)"
      [ngClass]="buttonClasses"
      class="inline-flex items-center justify-center font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg
        *ngIf="loading"
        class="animate-spin -ml-1 mr-2 h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <svg
        *ngIf="icon && !loading"
        class="h-5 w-5"
        [ngClass]="{ 'mr-2': hasContent }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          [attr.d]="iconPath"
        />
      </svg>
      <ng-content></ng-content>
    </button>
  `,
})
export class ButtonComponent {
  @Input() type: "button" | "submit" | "reset" = "button";
  @Input() variant: "primary" | "secondary" | "danger" | "success" = "primary";
  @Input() size: "sm" | "md" | "lg" = "md";
  @Input() disabled = false;
  @Input() loading = false;
  @Input() icon?: string;
  @Input() fullWidth = false;
  @Output() clicked = new EventEmitter<Event>();

  get hasContent(): boolean {
    return true;
  }

  get buttonClasses(): string {
    const baseClasses = this.fullWidth ? "w-full" : "";
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 sm:px-6 py-2 text-sm sm:text-base",
      lg: "px-6 sm:px-8 py-3 text-base sm:text-lg",
    };
    const variantClasses = {
      primary:
        "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500",
      secondary:
        "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
      danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
      success:
        "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
    };

    return `${baseClasses} ${sizeClasses[this.size]} ${variantClasses[this.variant]}`;
  }

  get iconPath(): string {
    const icons: { [key: string]: string } = {
      plus: "M12 6v6m0 0v6m0-6h6m-6 0H6",
      edit: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
      trash:
        "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
      search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
      check: "M5 13l4 4L19 7",
    };
    return icons[this.icon || ""] || "";
  }

  handleClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}
