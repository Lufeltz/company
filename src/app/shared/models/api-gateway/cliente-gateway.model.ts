import { EnderecoGateway } from './endereco-gateway.model';

export class ClienteGateway {
  idCliente: number = 0;
  cpf: string = '';
  email: string = '';
  nome: string = '';
  saldoMilhas: number = 0;
  endereco: EnderecoGateway = new EnderecoGateway();
}
