import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterLocationsComponent } from './center-locations.component';

describe('CenterLocationsComponent', () => {
  let component: CenterLocationsComponent;
  let fixture: ComponentFixture<CenterLocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CenterLocationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CenterLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
