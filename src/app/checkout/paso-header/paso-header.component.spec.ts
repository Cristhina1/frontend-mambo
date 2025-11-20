import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasoHeaderComponent } from './paso-header.component';

describe('PasoHeaderComponent', () => {
  let component: PasoHeaderComponent;
  let fixture: ComponentFixture<PasoHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasoHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasoHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
