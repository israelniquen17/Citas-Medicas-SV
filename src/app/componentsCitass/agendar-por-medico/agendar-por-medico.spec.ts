import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendarPorMedicoComponent } from './agendar-por-medico';

describe('AgendarPorMedico', () => {
  let component: AgendarPorMedicoComponent;
  let fixture: ComponentFixture<AgendarPorMedicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendarPorMedicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendarPorMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
