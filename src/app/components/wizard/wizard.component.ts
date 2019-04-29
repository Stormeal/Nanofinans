import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit {

  simpleSlider = 345;
  yearSlider = 14;
  doubleSlider = [20, 60];
  state = true;

  itemList = [];
  selectedItems = [];
  settings = {};

  itemList2 = [];
  selectedItems2 = [];

  constructor() { }

  ngOnInit() {
    this.itemList = [
      { 'id': 1, 'itemName': 'Vælg Arbeidsforhold' },
      { 'id': 2, 'itemName': 'Fast Ansat (Offentlig)' },
      { 'id': 3, 'itemName': 'Midlertidig ansatt/vikar' },
      { 'id': 4, 'itemName': 'Pensjonist' },
      { 'id': 5, 'itemName': 'Arbejdsledig' },
      { 'id': 6, 'itemName': 'Arbeidsavklarig/attføring' },
      { 'id': 7, 'itemName': 'Uføretrygdet' },
      { 'id': 8, 'itemName': 'Fast ansatt (Privat)' },
      { 'id': 9, 'itemName': 'Langtidssykemeldt' },
      { 'id': 10, 'itemName': 'Selvst. næringsdrivende' },
    ];

    this.itemList2 = [
      { 'id': 1, 'itemName': 'Vælg Utdanning' },
      { 'id': 2, 'itemName': 'Grunnskole' },
      { 'id': 3, 'itemName': 'Videregående' },
      { 'id': 4, 'itemName': 'Høysk./universitet 1-3 år' },
      { 'id': 5, 'itemName': 'Høysk./universitet 4+ år' },
    ];

    this.selectedItems = [
      { 'id': 1, 'itemName': 'Vælg Arbeidsforhold' }];
    this.settings = {
      singleSelection: true, text: 'Vælg Arbeidsforhold',
      classes: 'myclass custom-class-example'
    };

    this.selectedItems2 = [
      { 'id': 1, 'itemName': 'Vælg Utdanning' }];
    this.settings = {
      singleSelection: true, text: 'Vælg Utdanning',
      classes: 'myclass custom-class-example'
    };
  }
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }

  onItemSelect2(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  OnItemDeSelect2(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  onSelectAll2(items: any) {
    console.log(items);
  }
  onDeSelectAll2(items: any) {
    console.log(items);
  }
}



