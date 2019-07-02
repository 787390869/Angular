import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsedCarComponent } from './used-car.component';

describe('UsedCarComponent', () => {
  let component: UsedCarComponent;
  let fixture: ComponentFixture<UsedCarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsedCarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsedCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
