export class Aeroporto {
  codigoAeroporto: string = '';
  nome: string = '';
  cidade: string = '';
  estado: string = '';
}

export class VooGateway {
  codigoVoo: string = '';
  dataVoo: string = '';
  valorPassagem: number = 0;
  quantidadePoltronasTotal: number = 0;
  quantidadePoltronasOcupadas: number = 0;
  estadoVoo: string = '';
  aeroportoOrigem: Aeroporto = new Aeroporto();
  aeroportoDestino: Aeroporto = new Aeroporto();
}
