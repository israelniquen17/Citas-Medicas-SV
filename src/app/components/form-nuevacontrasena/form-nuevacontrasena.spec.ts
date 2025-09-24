import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNuevacontrasena } from './form-nuevacontrasena';

describe('FormNuevacontrasena', () => {
  let component: FormNuevacontrasena;
  let fixture: ComponentFixture<FormNuevacontrasena>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormNuevacontrasena]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormNuevacontrasena);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
