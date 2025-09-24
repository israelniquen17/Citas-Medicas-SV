import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteSemanalComponent } from './reporte-semanal';

describe('ReporteSemanal', () => {
  let component: ReporteSemanalComponent;
  let fixture: ComponentFixture<ReporteSemanalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteSemanalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteSemanalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
