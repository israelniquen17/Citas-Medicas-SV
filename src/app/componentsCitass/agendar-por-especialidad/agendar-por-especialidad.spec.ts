import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendarPorEspecialidadComponent } from './agendar-por-especialidad';

describe('AgendarPorEspecialidad', () => {
  let component: AgendarPorEspecialidadComponent;
  let fixture: ComponentFixture<AgendarPorEspecialidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendarPorEspecialidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendarPorEspecialidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
