import { EnderecoDto } from "./endereco-dto.model";
import { UsuarioResponseDto } from "./usuario-response-dto.model";

export class ClienteDto {
    idCliente: number = 0;
    cpf: string = '';
    telefone: string = '';
    endereco: EnderecoDto = new EnderecoDto();
    usuario: UsuarioResponseDto = new UsuarioResponseDto();
}
