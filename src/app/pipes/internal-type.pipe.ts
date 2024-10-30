import { Pipe, PipeTransform } from '@angular/core';
import { InternalType } from '@model/types/constants-config';

@Pipe({
  name: 'internalType',
  standalone: true
})
export class InternalTypePipe implements PipeTransform {

  transform(value: InternalType, ...args: unknown[]): unknown {
    if(value == null){
      return
    }
    return value.name;
  }

}
