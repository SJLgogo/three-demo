import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { SetupPostEditComponent } from './post-edit.component';

describe('SetupPostEditComponent', () => {
  let component: SetupPostEditComponent;
  let fixture: ComponentFixture<SetupPostEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupPostEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupPostEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
