import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sales-directory',
  templateUrl: './sales-directory.component.html',
  styleUrls: ['./sales-directory.component.scss']
})
export class SalesDirectoryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  inputValue?: string;
  options: Array<{ value: string; category: string; count: number }> = [];

  onChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    this.options = new Array(this.getRandomInt(5, 15))
      .join('.')
      .split('.')
      .map((_item, idx) => ({
        value,
        category: `${value}${idx}`,
        count: this.getRandomInt(200, 100)
      }));
  }

  private getRandomInt(max: number, min: number = 0): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
