import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { SetupPostCheckRoleTableComponent } from './post-check-role-table.component';

describe('SetupPostCheckRoleTableComponent', () => {
  let component: SetupPostCheckRoleTableComponent;
  let fixture: ComponentFixture<SetupPostCheckRoleTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupPostCheckRoleTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupPostCheckRoleTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
