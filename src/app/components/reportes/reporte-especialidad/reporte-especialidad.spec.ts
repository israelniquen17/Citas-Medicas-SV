import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteEspecialidadComponent } from './reporte-especialidad';

describe('ReporteEspecialidad', () => {
  let component: ReporteEspecialidadComponent;
  let fixture: ComponentFixture<ReporteEspecialidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteEspecialidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteEspecialidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
