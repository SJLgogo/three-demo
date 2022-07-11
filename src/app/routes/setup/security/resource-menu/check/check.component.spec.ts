import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SetupSecurityResourceMenuCheckComponent } from './check.component';

describe('SetupSecurityResourceMenuCheckComponent', () => {
  let component: SetupSecurityResourceMenuCheckComponent;
  let fixture: ComponentFixture<SetupSecurityResourceMenuCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SetupSecurityResourceMenuCheckComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupSecurityResourceMenuCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
