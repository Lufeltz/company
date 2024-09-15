import { Permissao } from './permissao.model';

export class Usuario{
  idUsuario: number = 0;
  email: string = '';
  senha: string = '';
  nome: string = '';
  permissao: Permissao = new Permissao();
}
