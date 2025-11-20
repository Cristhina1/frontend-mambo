import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteNavbarComponent } from './cliente-navbar.component';

describe('ClienteNavbar', () => {
  let component: ClienteNavbarComponent;
  let fixture: ComponentFixture<ClienteNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
