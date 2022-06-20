import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SystemRoutesComponent } from './routes.component';

describe('SystemRoutesComponent', () => {
  let component: SystemRoutesComponent;
  let fixture: ComponentFixture<SystemRoutesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SystemRoutesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
