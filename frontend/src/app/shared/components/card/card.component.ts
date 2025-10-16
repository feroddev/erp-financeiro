import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-card",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="bg-white rounded-xl shadow-lg overflow-hidden"
      [ngClass]="{ 'hover:shadow-xl transition-shadow': hoverable, 'p-4 sm:p-6': padding }"
    >
      <div *ngIf="title" class="mb-4 sm:mb-6">
        <h3 class="text-lg sm:text-xl font-bold text-gray-900">{{ title }}</h3>
        <p *ngIf="subtitle" class="text-sm text-gray-600 mt-1">{{ subtitle }}</p>
      </div>
      <ng-content></ng-content>
    </div>
  `,
})
export class CardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() hoverable = false;
  @Input() padding = true;
}
