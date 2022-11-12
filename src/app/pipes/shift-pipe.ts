import{Component,Pipe,PipeTransform} from '@angular/core';

@Pipe({name:'split'})
export class ShiftPosition implements PipeTransform {
  transform(items: any[], value: string): string {
      return items.toString().substr(1)+' ' +items.toString().substr(0);
  }
}