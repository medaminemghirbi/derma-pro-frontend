import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardAdminComponent } from './admin/dashboard-admin/dashboard-admin.component';
import { DoctorsComponent } from './admin/doctors/doctors.component';
import { PlanningComponent } from './admin/planning/planning.component';

import { DashboardDoctorComponent } from './doctor/dashboard-doctor/dashboard-doctor.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { DoctorGuard } from './guards/doctor.guard';
import { AdminGuard } from './guards/admin.guard';
import { DoctorSettingsComponent } from './doctor/doctor-settings/doctor-settings.component';
import { PlanningDoctorComponent } from './doctor/planning-doctor/planning-doctor.component';
import { NotificationSettingsComponent } from './doctor/notification-settings/notification-settings.component';
import { MyPhoneNumbersComponent } from './doctor/my-phone-numbers/my-phone-numbers.component';
import { DokumentsComponent } from './doctor/dokuments/dokuments.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ConsultationReportComponent } from './doctor/consultation-report/consultation-report.component';
import { PatientsListComponent } from './doctor/patients-list/patients-list.component';
import { HomeComponent } from './home/home.component';
import { ConsultationTypesComponent } from './admin/consultation-types/consultation-types.component';
import { AddNewPatientComponent } from './doctor/patients/add-new-patient/add-new-patient.component';
import { DoctorAddConsultationComponent } from './doctor/doctor-add-consultation/doctor-add-consultation.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  // Admin routes with guards
  { path: 'admin/dashboard', canActivate: [AdminGuard], component: DashboardAdminComponent },
  { path: 'admin/doctors', canActivate: [AdminGuard], component: DoctorsComponent },
  { path: 'admin/planning', canActivate: [AdminGuard], component: PlanningComponent },
  { path: 'admin/consultation-types', canActivate: [AdminGuard], component: ConsultationTypesComponent },
  // Doctor routes with guards
  { path: 'doctor/dashboard', canActivate: [DoctorGuard], component: DashboardDoctorComponent },
  { path: 'doctor/planning', canActivate: [DoctorGuard], component: PlanningDoctorComponent },
  { path: 'doctor/dokuments', canActivate: [DoctorGuard], component: DokumentsComponent },
  { path: 'doctor/settings', canActivate: [DoctorGuard], component: DoctorSettingsComponent },
  { path: 'doctor/settings/notifications', canActivate: [DoctorGuard], component: NotificationSettingsComponent },
  { path: 'doctor/settings/my-phone-numbers', canActivate: [DoctorGuard], component: MyPhoneNumbersComponent },
  { path: 'doctor/patients', component: PatientsListComponent },
  { path: 'doctor/patients/add-new-patient', canActivate: [DoctorGuard], component: AddNewPatientComponent },
  {path: 'consultations/:consultationId/report',component:ConsultationReportComponent},

  {path:'doctor/add-new-consultation/:consultation_date', component:DoctorAddConsultationComponent},
  // Shared components
  {path:':token/reset', component: ResetPasswordComponent},
  {path:'forgot-password',component:ForgotPasswordComponent},


  // Wildcard route
  { path: '**', component: UnauthorizedComponent } // or PageNotFoundComponent for 404 scenarios
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
