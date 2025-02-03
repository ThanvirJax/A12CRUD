import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumMessageFormComponent } from './forum-message-form.component';

describe('ForumMessageFormComponent', () => {
  let component: ForumMessageFormComponent;
  let fixture: ComponentFixture<ForumMessageFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForumMessageFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ForumMessageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
