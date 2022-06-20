import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DictSwaggerListComponent } from './swagger-list.component';

describe('DictSwaggerListComponent', () => {
  let component: DictSwaggerListComponent;
  let fixture: ComponentFixture<DictSwaggerListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DictSwaggerListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DictSwaggerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
