import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaCitasComponent } from './tabla-citas';

describe('TablaCitas', () => {
  let component: TablaCitasComponent;
  let fixture: ComponentFixture<TablaCitasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaCitasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaCitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
