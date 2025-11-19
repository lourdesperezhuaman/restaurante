import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiseñoComponent } from './diseño.component';

describe('DiseñoComponent', () => {
  let component: DiseñoComponent;
  let fixture: ComponentFixture<DiseñoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiseñoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiseñoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
