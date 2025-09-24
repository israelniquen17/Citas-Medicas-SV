import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaMedicosComponent } from './tabla-medicos-component';

describe('TablaMedicosComponent', () => {
  let component: TablaMedicosComponent;
  let fixture: ComponentFixture<TablaMedicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaMedicosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaMedicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
