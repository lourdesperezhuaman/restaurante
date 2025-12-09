import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPlatoComponent } from './formulario-plato.component';

describe('FormularioPlatoComponent', () => {
  let component: FormularioPlatoComponent;
  let fixture: ComponentFixture<FormularioPlatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioPlatoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioPlatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
