import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { SetupPostCheckUserTableComponent } from './post-check-user-table.component';

describe('SetupPostCheckUserTableComponent', () => {
  let component: SetupPostCheckUserTableComponent;
  let fixture: ComponentFixture<SetupPostCheckUserTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupPostCheckUserTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupPostCheckUserTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
