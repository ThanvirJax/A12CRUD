import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CDonationFormComponent } from './c-donation-form.component';

describe('CDonationFormComponent', () => {
  let component: CDonationFormComponent;
  let fixture: ComponentFixture<CDonationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CDonationFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CDonationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
