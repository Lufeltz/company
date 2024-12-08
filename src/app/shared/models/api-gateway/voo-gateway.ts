import { AeroportoGateway } from './aeroporto-gateway.model';

export class VooGateway {
  codigoVoo: string = '';
  dataVoo: string = '';
  valorPassagem: number = 0;
  quantidadePoltronasTotal: number = 0;
  quantidadePoltronasOcupadas: number = 0;
  estadoVoo: string = '';
  aeroportoOrigem: AeroportoGateway = new AeroportoGateway();
  aeroportoDestino: AeroportoGateway = new AeroportoGateway();
}
