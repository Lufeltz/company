import { VooGateway } from './voo-gateway';

export class ReservaGateway {
  codigoReserva: string = '';
  dataReserva: string = '';
  valorReserva: number = 0;
  milhasUtilizadas: number = 0;
  quantidadePoltronas: number = 0;
  idCliente: number = 0;
  siglaEstadoReserva: string = '';
  tipoEstadoReserva: string = '';
  voo: VooGateway = new VooGateway();
}
