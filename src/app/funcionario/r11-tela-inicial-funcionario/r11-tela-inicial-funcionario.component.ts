import { Component, OnInit } from '@angular/core';
import { VoosService } from '../../services/prototipo/voos.service';
import { CommonModule } from '@angular/common';
import { Voo } from '../../shared/models/prototipo/voo.model';

@Component({
  selector: 'app-r11-tela-inicial-funcionario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './r11-tela-inicial-funcionario.component.html',
  styleUrl: './r11-tela-inicial-funcionario.component.css',
})
export class R11TelaInicialFuncionarioComponent implements OnInit {
  public voos: Voo[] = [];

  constructor(private voosService: VoosService) {}

  ngOnInit(): void {
    this.getAllvoos();
  }

  getAllvoos() {
    this.voosService.getAllVoos().subscribe({
      next: (data: Voo[] | null) => {
        if (data == null) {
          this.voos = [];
        } else {
          this.voos = data;
        }
      },
      error: (err) => {
        console.log('Erro ao carregar voos');
      },
    });
  }
}
