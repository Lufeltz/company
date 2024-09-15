import { Endereco } from "./endereco.model";
import { Usuario } from "./usuario.model";

export class Cliente extends Usuario{
    idCliente: number = 0;
    cpf: string = "";
    telefone: string = '';
    usuario: Usuario = new Usuario();
    endereco: Endereco = new Endereco();
}
