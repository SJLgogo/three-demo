import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { SetupPostBindUserComponent } from './post-bind-user.component';

describe('SetupPostBindUserComponent', () => {
  let component: SetupPostBindUserComponent;
  let fixture: ComponentFixture<SetupPostBindUserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupPostBindUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupPostBindUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
