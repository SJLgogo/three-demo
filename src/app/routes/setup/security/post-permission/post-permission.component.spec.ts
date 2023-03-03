import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { SetupPostPermissionComponent } from './post-permission.component';

describe('SetupPostPermissionComponent', () => {
  let component: SetupPostPermissionComponent;
  let fixture: ComponentFixture<SetupPostPermissionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupPostPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupPostPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
