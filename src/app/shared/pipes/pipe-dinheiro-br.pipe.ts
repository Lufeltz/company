import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeDinheiroBR',
  standalone: true
})
export class PipeDinheiroBRPipe implements PipeTransform {

  transform(value: number, decimalSeparator: string = ',', thousandSeparator: string = '.'): string {
    let formattedNumber = value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    if (thousandSeparator !== '.') {
      formattedNumber = formattedNumber.replace(/\./g, thousandSeparator);
    }
    if (decimalSeparator !== ',') {
      formattedNumber = formattedNumber.replace(/,/g, decimalSeparator);
    }

    return formattedNumber;
  }

}
