import {
  Component, OnInit, AfterContentInit, ContentChildren, QueryList, ElementRef, Input, HostListener, ViewChild,
  ChangeDetectorRef, AfterViewInit, ChangeDetectionStrategy
} from '@angular/core';
import {PreventPanService, GhostClickService, VariantsService} from "../../../core";
import {Subscription} from "rxjs";
declare var ZingTouch;


@Component({
  selector: 'carousel',
  template: `
    <div class="slides" #slidesContainerRef>
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./carousel.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class CarouselComponent implements OnInit, AfterContentInit, AfterViewInit {
  @ContentChildren('carouselItem')items:QueryList<ElementRef>;
  @ViewChild('slidesContainerRef')slidesContainerRef:ElementRef;
  @Input('isEnabled')
  set isTop (isTop:boolean) {
    if( isTop) {
      this.draggingDisabled = false;
    } else if (!isTop) {
      this.draggingDisabled = true;
    }
  }
  @Input('carouselRegion')
  carouselRegion:HTMLElement;

  @Input('externalListenElement')
  externalListenElement:HTMLElement;

  TRANSITION:string = 'transition';
  el:HTMLElement;
  device_w:number;
  sticks:any[];
  slides:any[] = [];
  mouseShift:number;
  index:number = 0;
  length:number = 0;
  panLimit:number = 300;
  transition:string = 'transition';
  panType:string;
  currentPanType:string;
  prevTranslateX:number = 0;
  lastPanEnd:number = 0;
  panOnSlides:Subscription;
  listenElement:HTMLElement;
  slidesContainer:HTMLElement;
  listenRegion:any;
  panStart:boolean;
  panMove:boolean;
  draggingDisabled:boolean;

  constructor(
    el: ElementRef,
    private preventPanService:PreventPanService,
    private variantsService : VariantsService,
    private ghostClickService:GhostClickService,
    private cdr:ChangeDetectorRef
  ) {
    this.el = el.nativeElement;
  }

  @HostListener('mouseleave',['$event']) onMouseLeave(e){
    if(this.panMove) this.onPanEnd();
  }

  ngOnInit() {
    this.panOnSlides = this.preventPanService
      ._panOnSlides
      .subscribe(status => {
        this.draggingDisabled = status;
      });
  }

  ngAfterViewInit() {

    this.device_w = this.el.clientWidth ? this.el.clientWidth : parseInt(getComputedStyle(this.el).width)

    this.listenElement   = this.externalListenElement;
    this.slidesContainer = this.slidesContainerRef.nativeElement;

    /*create listenRegion*/

    this.listenRegion = new ZingTouch.Region(this.carouselRegion, false, false, 3);

    this.bindListeners();
  }

  ngAfterContentInit(){
    this.items
      .changes
      .subscribe(slides => {
        this.length = slides.toArray().length;
      })

    this.length = this.items.toArray().length;
  }

  bindListeners () {

    let panGesture = new ZingTouch.Pan({
      threshold:3
    });

    const panStart = panGesture.start;

    const self = this;

    panGesture.start = function (inputs) {
      !self.panStart || self.draggingDisabled ? self.onPanStart(inputs) : null;
      return panStart.call(this,inputs);
    };

    const panEnd = panGesture.end;

    panGesture.end = function (inputs) {
      self.panMove ? self.onPanEnd() : null;
      return panEnd.call(this,inputs)
    };

    this.listenRegion.bind(this.listenElement, panGesture, function(e) {
      if(!self.panStart || self.draggingDisabled) return;

      const panLeft:boolean = e.detail.data[0].currentDirection < 200 && e.detail.data[0].currentDirection > 160;
      const panRight:boolean = e.detail.data[0].currentDirection < 20 || e.detail.data[0].currentDirection > 340;

      if(panLeft || panRight) {
        self.panType = (panLeft && !self.panType) ? 'panleft' : (panRight && !self.panType) ? "panright" : self.panType;
        self.currentPanType = panLeft ? 'panleft' : "panright";

        self.onPanMove(e.detail.data[0],self.panType);
      } else {
        /*prevent scroll up and down*/
        e.detail.events[0].originalEvent.preventDefault();
      }

    });

  }

  onPanStart (e) {
    this.removeTransition();
    this.panStart = true;
  }

  onPanMove (e,panType:string) {
    this.panMove = true;
    this.mouseShift = +((e.distanceFromOrigin / this.device_w )*100).toFixed(2) ;

    if ( panType ==='panleft' && this.index !== (this.length - 1) ) {
      this.onPanLeft();
    } else if ( panType ==='panright' && this.index !== 0) {
      this.onPanRight();
    } else {
      this.panType = null;
    }
  }

  onPanLeft () {

    let newTranslateX = ` ${ this.prevTranslateX - this.mouseShift}%`;
    this.slidesContainer.style.transform = `translateX( ${ newTranslateX } )`;

    /*prevent panup and down on the parent element*/
    this.preventPanService.preventPanOnCards(true);
  }

  onPanRight () {

    let newTranslateX = ` ${ this.prevTranslateX + this.mouseShift}%`;
    this.slidesContainer.style.transform = `translateX( ${ newTranslateX } )`;
    this.preventPanService.preventPanOnCards(true);
  }

  onPanEnd () {

    if(this.currentPanType === this.panType) {

      if (this.currentPanType === 'panleft') {
        /*last slide*/
        if ( this.index === (this.length - 1)) return;
        this.index++;
      } else if ( this.currentPanType === 'panright' ) {
        // /*first slide*/
        if ( this.index === 0) return;
        this.index--;
      }

    }

    this.addTransition();
    this.prevTranslateX = this.index * 94 * (-1) - (this.index - 1);

    this.setTranslateX(this.slidesContainer,this.prevTranslateX)

    this.lastPanEnd = Date.now();
    this.panStart = false;
    this.panType = null;
    this.panMove = false;

    this.preventPanService.preventPanOnCards(false);
    this.ghostClickService.setLastCallRoom( Date.now() );

    /*send index room*/
    this.variantsService.setVariantIndex( this.index )
  }

  setTranslateX(elem:HTMLElement,translateX){
    if(!elem || typeof translateX  !== 'number')return;
    elem.style.transform = `translateX(${ translateX }%)`;
  }

  removeTransition () {
    this.slidesContainer.classList.remove(this.TRANSITION);
  }

  addTransition (){
    this.slidesContainer.classList.add(this.TRANSITION);
  }

  ngOnDestroy () {
    if ( this.listenRegion ) {
      this.listenRegion.unbind(this.listenElement);
    }

    this.panOnSlides.unsubscribe();
  }
}
