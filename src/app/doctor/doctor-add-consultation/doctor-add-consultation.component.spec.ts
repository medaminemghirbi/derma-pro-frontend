import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorAddConsultationComponent } from './doctor-add-consultation.component';

describe('DoctorAddConsultationComponent', () => {
  let component: DoctorAddConsultationComponent;
  let fixture: ComponentFixture<DoctorAddConsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorAddConsultationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorAddConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
