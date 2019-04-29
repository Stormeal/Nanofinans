import { Component, OnInit, Renderer, OnDestroy } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import * as Rellax from 'rellax';

@Component({
    selector: 'app-components',
    templateUrl: './components.component.html',
    styles: [`
    ngb-progressbar {
        margin-top: 5rem;
    }

    .h_work_area {
        background: white;
        padding: 95px 0px;
      }
      
      .h_work_area .main_title {
        padding-bottom: 60px;
      }
      
      .h_work_inner {
        position: relative;
      }
      
      .h_work_inner:before {
        content: "";
        max-width: 66%;
        width: 100%;
        position: absolute;
        height: 2px;
        top: 28px;
        border: 1px dashed #4aa54e;
        left: 50%;
        -webkit-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
        transform: translateX(-50%);
      }
      
      .h_work_inner .h_work_item {
        text-align: center;
        cursor: pointer;
      }
      
      .h_work_inner .h_work_item .h-round:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-image: -webkit-radial-gradient(rgba(30, 141, 238, 0.1), rgb(134, 184, 157));
        background-image: -o-radial-gradient(rgba(30, 141, 238, 0.1), rgb(134, 184, 157));
        background-image: radial-gradient(rgba(30, 141, 238, 0.1), rgb(134, 184, 157));
        z-index: -1;
        border-radius: 50%;
        -webkit-transform: scale(1);
        -ms-transform: scale(1);
        transform: scale(1);
        -webkit-transition: all 0.5s linear;
        -o-transition: all 0.5s linear;
        transition: all 0.5s linear;
      }
      
      .h_work_inner .h_work_item .h-title {
        margin: 24px 0px 12px;
      }
      
      .h_work_inner .h_work_item:hover .h-round:before {
        -webkit-transform: scale(1.4);
        -ms-transform: scale(1.4);
        transform: scale(1.4);
        opacity: 0;
      }
      
      .h_work_inner .h_work_item:hover h3 {
        color: rgb(134, 184, 157);
      }
      
      .h-title {
        font: 400 18px/36px "Montserrat", sans-serif;
        letter-spacing: 0.36px;
        color: #424242;
        -webkit-transition: all 0.2s linear;
        -o-transition: all 0.2s linear;
        transition: all 0.2s linear;
      }
      
      .text-p {
        font: 400 14px/26px "Poppins", sans-serif;
        color: #6b6d6f;
        letter-spacing: 0.28px;
      }
      
      .h-round {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #4aa54e;
        font-size: 24px;
        line-height: 56px;
        color: #fff;
        display: inline-block;
        position: relative;
        z-index: 1;
        text-align: center;
      }
    `]
})

export class ComponentsComponent implements OnInit, OnDestroy {
    data: Date = new Date();

    page = 4;
    page1 = 5;
    page2 = 3;
    focus;
    focus1;
    focus2;

    date: { year: number, month: number };
    model: NgbDateStruct;

    public isCollapsed = true;
    public isCollapsed1 = true;
    public isCollapsed2 = true;

    state_icon_primary = true;

    constructor(private renderer: Renderer, config: NgbAccordionConfig) {
        config.closeOthers = true;
        config.type = 'info';
    }
    isWeekend(date: NgbDateStruct) {
        const d = new Date(date.year, date.month - 1, date.day);
        return d.getDay() === 0 || d.getDay() === 6;
    }

    isDisabled(date: NgbDateStruct, current: { month: number }) {
        return date.month !== current.month;
    }

    ngOnInit() {
        var rellaxHeader = new Rellax('.rellax-header');

        var navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.add('navbar-transparent');
        var body = document.getElementsByTagName('body')[0];
        body.classList.add('index-page');
    }
    ngOnDestroy() {
        var navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.remove('navbar-transparent');
        var body = document.getElementsByTagName('body')[0];
        body.classList.remove('index-page');
    }
}
