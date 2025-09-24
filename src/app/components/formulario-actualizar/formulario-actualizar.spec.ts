import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormularioActualizarComponent } from './formulario-actualizar';

describe('FormularioActualizarComponent', () => {
  let component: FormularioActualizarComponent;
  let fixture: ComponentFixture<FormularioActualizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioActualizarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioActualizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
