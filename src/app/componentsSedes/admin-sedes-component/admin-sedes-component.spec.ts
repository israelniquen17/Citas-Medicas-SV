import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSedesComponent } from './admin-sedes-component';

describe('AdminSedesComponent', () => {
  let component: AdminSedesComponent;
  let fixture: ComponentFixture<AdminSedesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSedesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSedesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
