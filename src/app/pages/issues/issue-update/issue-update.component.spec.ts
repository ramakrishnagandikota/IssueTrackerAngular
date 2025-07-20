import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueUpdateComponent } from './issue-update.component';

describe('IssueUpdateComponent', () => {
  let component: IssueUpdateComponent;
  let fixture: ComponentFixture<IssueUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IssueUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
