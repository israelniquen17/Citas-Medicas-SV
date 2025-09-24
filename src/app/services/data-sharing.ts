import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataSharingService {
  private refrescarMedicosSubject = new Subject<void>();
  refrescarMedicos$ = this.refrescarMedicosSubject.asObservable();

   private refrescarMedicosSource = new Subject<void>();

  emitirRefrescarMedicos() {
    this.refrescarMedicosSubject.next();
  }
  
  notificarRefrescarMedicos() {
    this.refrescarMedicosSource.next();
}
}