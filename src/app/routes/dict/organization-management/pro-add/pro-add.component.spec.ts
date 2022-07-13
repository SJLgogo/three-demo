import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProAddComponent } from './pro-add.component';

describe('ProAddComponent', () => {
  let component: ProAddComponent;
  let fixture: ComponentFixture<ProAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
