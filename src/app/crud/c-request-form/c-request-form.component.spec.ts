import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRequestFormComponent } from './c-request-form.component';

describe('CRequestFormComponent', () => {
  let component: CRequestFormComponent;
  let fixture: ComponentFixture<CRequestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CRequestFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
