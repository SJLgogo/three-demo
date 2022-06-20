import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DictSwaggerEditComponent } from './swagger-edit.component';

describe('DictSwaggerEditComponent', () => {
  let component: DictSwaggerEditComponent;
  let fixture: ComponentFixture<DictSwaggerEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DictSwaggerEditComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DictSwaggerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
