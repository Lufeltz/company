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
