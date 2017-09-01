import { Component,OnInit, Input, EventEmitter,Output } from '@angular/core';
declare var $:any;

@Component({
    selector:'paginator',
    template:`
        <div  class="ui pagination menu" (click)="changePage($event)">
            <a routerLink="{{url}}/{{(p_current > 1) ? (p_current - 1) : '' }}" class="icon item">
                <i class="left chevron icon"></i>
            </a>
             <a routerLink="{{url}}/{{number}}" routerLinkActive="active" *ngFor="let number of current_arr"   class="item">
                {{number}}
             </a>
            <a routerLink="{{url}}/{{(p_current < arr.length) ? (p_current + 1): '' }}"  class="icon item">
                <i class="right chevron icon"></i>
            </a>
        </div>
    `,
    styleUrls: ['../app.component.css'],
})

export class PaginatorComponent implements OnInit{

    link_amount:number = 10;
    arr:Array<Number> = [];
    current_arr:Array<Number> = [];
    //pages amount
    @Input() total:number;
    //current page
    @Input() p_current:number;
    @Input() url:string;
    @Output() pageChange:EventEmitter<any> = new EventEmitter();

    ngOnInit(){

        for(let i = 1; i <= this.total;i++){
            this.arr.push(i);
        }

        let index = this.arr.indexOf(this.p_current);
        this.changePaginator(index);
    }

    changePage(e){
        let page = e.target.innerText;
        let index = this.arr.indexOf(this.p_current);
        this.changePaginator(index);
    }

    changePaginator(index:number){

        if(index > 4){
            this.current_arr = this.arr.slice(index-5, index + 5);
        }
        else {
            this.current_arr = this.arr.slice(0, this.link_amount);
        }

    }

}

