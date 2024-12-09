export class ReservaCriacaoGateway {
  codigoReserva: string | null = null;
  dataReserva: string | null = null;
  valorReserva: number = 0;
  milhasUtilizadas: number = 0;
  quantidadePoltronas: number = 0;
  idCliente: number = 0;
  siglaEstadoReserva: string | null = null;
  tipoEstadoReserva: string | null = null;
  codigoVoo: string = '';
  codigoAeroportoOrigem: string = '';
  codigoAeroportoDestino: string = '';
}
