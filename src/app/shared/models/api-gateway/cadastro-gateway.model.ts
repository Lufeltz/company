import { EnderecoGateway } from './endereco-gateway.model';

export class CadastroGateway {
  cpf: string = '';
  nome: string = '';
  email: string = '';
  telefone: string = '';
  endereco: EnderecoGateway = new EnderecoGateway();
  senha: string = '';
}
