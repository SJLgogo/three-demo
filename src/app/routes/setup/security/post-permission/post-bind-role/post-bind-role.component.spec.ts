import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { SetupPostBindRoleComponent } from './post-bind-role.component';

describe('SetupPostBindRoleComponent', () => {
  let component: SetupPostBindRoleComponent;
  let fixture: ComponentFixture<SetupPostBindRoleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupPostBindRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupPostBindRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
