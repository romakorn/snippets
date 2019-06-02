import {Component, Input, ChangeDetectionStrategy, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {Variant} from "../../../../_models/Variant";

@Component({
  selector: 'hotel-variant',
  template: `
    <div
        class="bg-img slide"
         [style.background]="variant?.images ? 'url(' + variant?.images[0]?.image + ')' : ''"
         [style.background-size]="'cover'"
         [class.active]="i === variantIndex"
    >
      <div class="img-overlay" [class.active]="variantIndex === i">
        <div class="d-flex j-c-c room-offer" *ngIf="variant?.rate?.attributedOffer">
          <div class="offer-box">{{variant?.rate?.attributedOffer?.title}}</div>
        </div>
        <div class="room-desc">
          <div class="room-title text-center">{{variant?.title| capitalize }}</div>
          <div class="text-uppercase f-s-1 p-t-10 text-center bold">{{variant?.variantSize}}</div>
          <div class="text-uppercase f-s-1 text-center bold" *ngIf="variant?.rate?.amount">
            {{guests}} GUESTS
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./hotel-variant.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class HotelVariantComponent implements AfterViewInit{

  @Input()variant:Variant;
  @Input('index')i:number;
  @Input()variantIndex:number;
  el:HTMLElement;

  constructor() {
  }


  ngAfterViewInit(){
  }
}
