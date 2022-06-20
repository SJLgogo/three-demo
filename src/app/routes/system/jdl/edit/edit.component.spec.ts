import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemJdlEditComponent } from './edit.component';

describe('SystemJdlEditComponent', () => {
  let component: SystemJdlEditComponent;
  let fixture: ComponentFixture<SystemJdlEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SystemJdlEditComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemJdlEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
