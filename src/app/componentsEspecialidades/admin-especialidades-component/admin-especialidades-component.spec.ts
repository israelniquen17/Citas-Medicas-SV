import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEspecialidadesComponent } from './admin-especialidades-component';

describe('AdminEspecialidadesComponent', () => {
  let component: AdminEspecialidadesComponent;
  let fixture: ComponentFixture<AdminEspecialidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEspecialidadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEspecialidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
