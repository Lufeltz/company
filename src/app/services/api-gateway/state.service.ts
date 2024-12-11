import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private updateFuncionariosSubject = new Subject<void>();
  private updateVoosFuncionariosSubject = new Subject<void>();
  

  // Observables
  updateFuncionarios$ = this.updateFuncionariosSubject.asObservable();
  updateVoosFuncionarios$ = this.updateVoosFuncionariosSubject.asObservable();

  // Triggers
  triggerUpdateListagemFuncionarios() {
    this.updateFuncionariosSubject.next();
  }

  triggerUpdateListagemVoosFuncionarios() {
    this.updateVoosFuncionariosSubject.next();
  }
}

// ngoninit
// this.stateService.updateFuncionarios$.subscribe(() => {
//   this.listarCampeonatos();
// });




          // this.stateService.triggerUpdateListagemFuncionarios();

// inscreverModalidade(modalidadeId: number) {
//   const user = this.authService.getUser();
//   if (user) {
//     const usuarioId = user.idAcademico;

//     this.modalidadesService
//       .inscreverModalidade(usuarioId, modalidadeId)
//       .subscribe({
//         next: (resp) => {
//           this.stateService.triggerUpdateListagemModalidades();
//           this.stateService.triggerUpdateListagemCampeonatos();
//         },
//         error: (err) => {
//           console.error('Erro ao realizar inscrição:', err);
//         },
//       });
//   }
// }
