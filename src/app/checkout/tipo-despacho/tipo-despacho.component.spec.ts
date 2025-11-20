import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoDespachoComponent } from './tipo-despacho.component';

describe('TipoDespachoComponent', () => {
  let component: TipoDespachoComponent;
  let fixture: ComponentFixture<TipoDespachoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoDespachoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoDespachoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
