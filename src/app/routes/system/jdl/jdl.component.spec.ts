import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemJdlComponent } from './jdl.component';

describe('SystemJdlComponent', () => {
  let component: SystemJdlComponent;
  let fixture: ComponentFixture<SystemJdlComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SystemJdlComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemJdlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
