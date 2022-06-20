import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemRoutesEditComponent } from './edit.component';

describe('SystemRoutesEditComponent', () => {
  let component: SystemRoutesEditComponent;
  let fixture: ComponentFixture<SystemRoutesEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SystemRoutesEditComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemRoutesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
