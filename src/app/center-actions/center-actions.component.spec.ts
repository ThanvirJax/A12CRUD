import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterActionsComponent } from './center-actions.component';

describe('CenterActionsComponent', () => {
  let component: CenterActionsComponent;
  let fixture: ComponentFixture<CenterActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CenterActionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CenterActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
