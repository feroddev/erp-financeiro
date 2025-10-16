import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-alert",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="message"
      class="mb-4 sm:mb-6 p-3 sm:p-4 rounded-r-lg border-l-4"
      [ngClass]="alertClasses"
    >
      <div class="flex items-start">
        <svg
          class="w-5 h-5 flex-shrink-0 mr-2 mt-0.5"
          [ngClass]="iconClasses"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            *ngIf="type === 'error'"
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
          <path
            *ngIf="type === 'success'"
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
          <path
            *ngIf="type === 'warning'"
            fill-rule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
          <path
            *ngIf="type === 'info'"
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          />
        </svg>
        <div class="flex-1">
          <p class="text-sm font-medium" [ngClass]="textClasses">
            {{ message }}
          </p>
        </div>
        <button
          *ngIf="dismissible"
          (click)="dismiss.emit()"
          class="ml-3 flex-shrink-0"
          [ngClass]="iconClasses"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  `,
})
export class AlertComponent {
  @Input() message = "";
  @Input() type: "error" | "success" | "warning" | "info" = "info";
  @Input() dismissible = false;
  @Output() dismiss = new EventEmitter<void>();

  get alertClasses(): string {
    const classes = {
      error: "bg-red-50 border-red-500",
      success: "bg-green-50 border-green-500",
      warning: "bg-yellow-50 border-yellow-500",
      info: "bg-blue-50 border-blue-500",
    };
    return classes[this.type];
  }

  get iconClasses(): string {
    const classes = {
      error: "text-red-500",
      success: "text-green-500",
      warning: "text-yellow-500",
      info: "text-blue-500",
    };
    return classes[this.type];
  }

  get textClasses(): string {
    const classes = {
      error: "text-red-800",
      success: "text-green-800",
      warning: "text-yellow-800",
      info: "text-blue-800",
    };
    return classes[this.type];
  }
}
