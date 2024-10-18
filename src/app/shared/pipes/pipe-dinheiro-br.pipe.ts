import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeDinheiroBR',
  standalone: true
})
export class PipeDinheiroBRPipe implements PipeTransform {

  transform(value: number, decimalSeparator: string = ',', thousandSeparator: string = '.'): string {
    // Formate o número com separador de milhar e casas decimais
    let formattedNumber = value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    // Substitua os separadores conforme necessário
    if (thousandSeparator !== '.') {
      formattedNumber = formattedNumber.replace(/\./g, thousandSeparator);
    }
    if (decimalSeparator !== ',') {
      formattedNumber = formattedNumber.replace(/,/g, decimalSeparator);
    }

    return formattedNumber;
  }

}
