import { Component } from '@angular/core';
import { ClientesService } from '../../services/prototipo/clientes.service';

@Component({
  selector: 'app-r03-mostrar-tela-inicial-cliente',
  standalone: true,
  imports: [],
  templateUrl: './r03-mostrar-tela-inicial-cliente.component.html',
  styleUrl: './r03-mostrar-tela-inicial-cliente.component.css'
})
export class R03MostrarTelaInicialClienteComponent {
  constructor(
    private clienteService: ClientesService,
  ) {}
}
