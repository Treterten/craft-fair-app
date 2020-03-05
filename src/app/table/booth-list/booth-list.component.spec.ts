import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoothListComponent } from './booth-list.component';

describe('BoothListComponent', () => {
  let component: BoothListComponent;
  let fixture: ComponentFixture<BoothListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoothListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoothListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
