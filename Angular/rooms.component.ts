import {Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, ViewChildren, QueryList} from '@angular/core';
import {Subscription} from "rxjs";
import {Variant} from "../../../_models/Variant";
import {Product} from "../../../_models/Product";
import {GhostClickService, ParallaxService, PagesService, VariantsService} from "../../core";

@Component({
  selector: 'rooms-card',
  template: `
    <section class="item rooms-card" data-position="">
      <div class="item-container" #carouselRegion>      
        
        <div class="rooms-background rooms-content" id="rooms-content">
          
          <carousel [isEnabled]="isTop" [externalListenElement]="listenElement" [carouselRegion]="carouselRegion">
          
            <ng-container *ngFor="let variant of variants; let i = index;">
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
              
              <!--<hotel-variant-->
                <!--#carouselItem-->
                <!--[variant]="variant" -->
                <!--[index]="i" -->
                <!--[variantIndex]="variantIndex" >-->
              <!--</hotel-variant>-->
            </ng-container>
          
          </carousel>
          
 
        </div>

        <div class="animate-container calc-padding" (click)="openOverview()">
          <div class="d-flex j-c-c rating-row preview">
            <span class="star" *ngFor="let star of stars"></span>
          </div>
          <div class="demo-text" >{{ overviewCard?.overviewDescription }}</div>
          
          <div class="partner-logo-cont" id="partner-logo" *ngIf="!campaignlink && partner?.logo && partner?.logo.image" >
            <img class="partner-logo" [src]="partner?.logo?.image" alt="partner logo" draggable="false">
          </div>
          
          <div class="campaign-promo" id="partner-logo"  *ngIf="campaignlink && campaignlink.campaign">
              <div class="l-h-1"><span class="gift-icon"></span></div>
              <div>{{campaignlink.campaign.rateDesc || ''}}</div> 
          </div>
          
          <div *ngIf="!campaignlink && !partner" id="partner-logo" class="partner-logo-cont explore-hotel">
            explore this hotel
          </div>
               
        </div>    

        <div class="rooms_overlay" (click)="openRoomDetails()" #listenElement>
         
          <div class="d-flex-row room-details">
            <span>Room Details</span>
            <span *ngIf="currentVariant?.rate?.amount && !currentVariant?.rate?.attributedOffer">
              {{currentVariant?.rate?.amount?.itemPrice | currency:currentVariant?.rate?.amount?.currency.toUpperCase():'symbol':'.0-0'}}
            </span>
            
            <span *ngIf="currentVariant?.rate?.attributedOffer">
              <span class="cross-out color000 p-r-5 font-StdBook">{{currentVariant?.rate?.attributedOffer.discountFrom?.currencySymbol + currentVariant?.rate?.attributedOffer.discountFrom?.itemPrice}}</span>
              <span>{{currentVariant?.rate?.amount?.itemPrice | currency:currentVariant?.rate?.amount?.currency.toUpperCase():'symbol':'.0-0'}}</span>
            </span>
          </div>
          
        </div>


      </div>
    </section>
    
  `,
})
export class RoomsComponent implements OnInit, OnDestroy {
  @ViewChild('card_container') card_container:ElementRef;
  @Input() product:Product;
  @Input() overviewCard:any;
  @Input() campaignlink:any;
  @Input() service:any;
  @Input() calendarParams:any;
  @Input()
    set hotelVariants(variants:Variant[]){
      this.variants = (variants && variants.length) ? variants : [];
    }
  @Input()
    set _ratesVariants(ratesVariants:Variant[]) {
      if(ratesVariants && ratesVariants.length) {
        this.proceedRatesVariants(ratesVariants);
        this.ratesVariants = ratesVariants;
      }

    }
  roomsCardIndex:number = 1;
  variants:Variant[] = [];
  ratesVariants:Variant[];
  place:string = 'ROOMS';
  indexSub:Subscription;
  scrollSub:Subscription;
  variantIndex:number = 0;
  currentVariant:Variant;
  sectionIndexSub:Subscription;
  isTop:boolean = false;
  guests:number = 2;
  partner:any;
  stars:number[] = [];
  slidesArr:HTMLElement[];


  constructor(
    private variantsService : VariantsService,
    private ghostClickService:GhostClickService,
    private parallaxService:ParallaxService,
    private pagesService:PagesService
  ) { }

  ngOnInit() {

    this.calendarParams = {guests:2};
    /*initial room variant*/
    this.currentVariant = this.variants[0];

    this.indexSub = this.variantsService.indexEmitter$.subscribe( index => {
      this.currentVariant = this.variants[index];
      this.variantIndex = index;
    });

    this.partner = this.product.partner || this.overviewCard.partner;

    const starsNumber:number = this.overviewCard.stars;
    if('number' === typeof starsNumber) {
      let stars = [];
      for(let i = 1; i<=starsNumber; i++) {
        stars.push(i);
      }
      this.stars = stars;
    }

    this.sectionIndexSub = this.parallaxService
      .sectionEmitter$
      .subscribe(sectionIndex => {
        this.isTop = sectionIndex === this.roomsCardIndex;
      });
    this.scrollSub = this.parallaxService
      .scrollToSection$
      .subscribe( sectionIndex => {
        this.isTop = sectionIndex === this.roomsCardIndex;
      })
  }

  ngAfterViewInit(){
    console.log('room view init', Date.now());
  }


  openRoomDetails() {
    /*prevent ghost click on desktop*/
    const isGhostClickParallax = Date.now() - this.ghostClickService.lastCall < this.ghostClickService.limit;
    const isGhostClickSlider = Date.now() - this.ghostClickService.lastCallRoom < this.ghostClickService.limit;

    if (isGhostClickParallax || isGhostClickSlider) return;

    if(this.currentVariant) {
      this.pagesService.openPage('room-details');
    }
  }

  proceedRatesVariants(ratesVariants:Variant[]):any {
    this.variants = ratesVariants;
    this.currentVariant = this.getCurrentVariant(this.variantIndex);
  }

  getCurrentVariant(variantIndex:number):Variant {
    return this.variants[variantIndex] || {} as Variant;
  }

  openOverview() {
    /*prevent ghost click on desktop once pan is finished*/
    if ( Date.now() - this.ghostClickService.lastCall < this.ghostClickService.limit ) return;

    this.pagesService.openPage('overview');
  }

  ngOnDestroy() {
    this.indexSub.unsubscribe();
    this.sectionIndexSub.unsubscribe();
    this.scrollSub.unsubscribe();
  }

}
