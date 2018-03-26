import {Directive, AfterContentInit, OnDestroy, ElementRef, OnInit, Input} from '@angular/core';
import { PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import 'hammerjs';
import {PreventPanService} from "../_services/prevent-pan.service";
import {Subscription} from "rxjs";

declare var $:any;

@Directive({
  selector: '[slides]'
})
export class SlidesDirective implements OnInit, AfterContentInit, OnDestroy {
  @Input() loaded:boolean;
  el:HTMLElement;
  hammerElem:any;
  device_w:number;
  sticks:any[];
  slides:any[];
  mouseShift:number;
  index:number = 0;
  length:number = 0;
  panLimit:number = 300;
  transition:string = 'transition';
  panType:string;
  prevTranslateX:number = 0;
  lastPanEnd:number = 0;
  panOnSlides:Subscription;
  listenElement:HTMLElement;

  constructor(
      el: ElementRef,
      private preventPanService:PreventPanService,
      @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.el = el.nativeElement;
  }

  ngOnInit() {
    this.panOnSlides = this.preventPanService._panOnSlides.subscribe(status => {
      status === true ? this.unbindListeners() : this.bindListeners();
    });
  }

  ngAfterContentInit () {
    this.device_w = this.el.clientWidth;
    this.slides = Array.from( $( this.el ).find('.slide') );
    this.sticks = Array.from( $( this.el ).closest('#slides-container').find('.stick') );

    /* add active class for first stick */

    this.sticks[0] ? this.sticks[0].classList.add('active') : '';
    let shift;

    this.slides.forEach( (elem, i) => {
      shift = `${ 0 + (i*100)}%`;
      elem.style.transform = `translateX(${ shift })`;

      this.length++;
    });

    this.listenElement = $(this.el).closest('#slides-container').find('.overlay_item')[0];

    this.bindListeners();
  }

  bindListeners () {

    this.hammerElem = new Hammer(this.listenElement);

    this.hammerElem.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL,threshold:5});

    /*event binding*/
    this.hammerElem.on("panmove", (e) => {
        this.limitMove(this.panLimit) ? this.onPanMove(e) : '';
    });

    this.hammerElem.on("panstart", () => {
        this.onPanStart();
    });

    this.hammerElem.on("panend", (e) => {
        this.onPanEnd();
    });
  }

  unbindListeners () {
    this.hammerElem.destroy();
  }

  onPanStart () {
    this.removeTransition();

    /*prevent panup and down on the parent element*/
    this.preventPanService.setStatusOnCards(true);
  }

  onPanMove (e) {

    this.mouseShift = +((e.deltaX / this.device_w )*100).toFixed(3) ;

    if ( e.deltaX < 0 ) {
        this.onPanLeft();
        this.panType = 'panleft';
    } else if ( e.deltaX > 0 ) {
        this.onPanRight();
        this.panType = 'panright';
    }
  }

  onPanLeft () {

    if ( this.index === (this.length - 1) ) return;

    let newTranslateX = ` ${ this.prevTranslateX + this.mouseShift}%`;
    this.el.style.transform = `translateX( ${ newTranslateX } )`;
  }

  onPanRight () {

    if ( this.index === 0 ) return;

    let newTranslateX = ` ${ this.prevTranslateX + this.mouseShift}%`;
    this.el.style.transform = `translateX( ${ newTranslateX } )`;
  }

  onPanEnd () {

    this.addTransition();

    if (this.panType === 'panleft') {
        this.onEndLeft();
    } else if ( this.panType === 'panright' ) {
        this.onEndRight()
    }

    this.lastPanEnd = Date.now();
    this.preventPanService.setStatusOnCards(false);
  }

  removeTransition () {
    this.el.classList.remove("transition");
  }

  addTransition (){
    this.el.classList.add("transition");
  }

  onEndLeft () {

    if ( this.index === (this.length - 1) ) return;

    this.sticks[this.index].classList.remove('active');
    this.index++;
    this.sticks[this.index].classList.add('active');

    this.prevTranslateX = this.index * 100 * (-1);
    this.el.style.transform = `translateX(${ this.prevTranslateX }%)`;
  }

  onEndRight () {

    if ( this.index === 0 ) return;

    this.sticks[this.index].classList.remove('active');
    this.index--;
    this.sticks[this.index].classList.add('active');

    this.prevTranslateX = this.index * 100 * (-1);
    this.el.style.transform = `translateX(${ this.prevTranslateX }%)`;
  }

  limitMove (limit):boolean {
    let diff = Date.now() - this.lastPanEnd;

    return ( diff > limit ) ? true : false;
  }

  ngOnDestroy () {
    if ( this.hammerElem ) {
      this.hammerElem.destroy();
    }

    this.panOnSlides.unsubscribe();
  }

}
