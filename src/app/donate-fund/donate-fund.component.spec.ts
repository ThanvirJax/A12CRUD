import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonateFundComponent } from './donate-fund.component';

describe('DonateFundComponent', () => {
  let component: DonateFundComponent;
  let fixture: ComponentFixture<DonateFundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonateFundComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DonateFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
