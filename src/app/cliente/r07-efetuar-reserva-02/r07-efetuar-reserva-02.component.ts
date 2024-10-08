import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Voo } from '../../shared/models/prototipo/voo.model';

@Component({
  selector: 'app-r07-efetuar-reserva-02',
  standalone: true,
  imports: [],
  templateUrl: './r07-efetuar-reserva-02.component.html',
  styleUrl: './r07-efetuar-reserva-02.component.css',
})
export class R07EfetuarReserva02Component implements OnInit {
  vooSelecionado!: Voo;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Recupera o voo selecionado a partir do estado
    this.vooSelecionado = history.state.vooSelecionado;

    // Caso o voo selecionado não seja encontrado (acesso direto à rota), redireciona de volta
    if (!this.vooSelecionado) {
      this.router.navigate(['/efetuar-reserva']);
    }
  }
}
