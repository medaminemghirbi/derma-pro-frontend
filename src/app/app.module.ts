import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardAdminComponent } from './admin/dashboard-admin/dashboard-admin.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './services/token.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderAdminComponent } from './admin/header-admin/header-admin.component';
import { SidebarAdminComponent } from './admin/sidebar-admin/sidebar-admin.component';
import { DoctorsComponent } from './admin/doctors/doctors.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from "ngx-progressbar/http";
import { PlanningComponent } from './admin/planning/planning.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DashboardDoctorComponent } from './doctor/dashboard-doctor/dashboard-doctor.component';
import { PlanningDoctorComponent } from './doctor/planning-doctor/planning-doctor.component';
import { DoctorHeaderComponent } from './doctor/doctor-header/doctor-header.component';
import { DoctorSidebarComponent } from './doctor/doctor-sidebar/doctor-sidebar.component';
import { ToastrModule } from 'ngx-toastr';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { DoctorSettingsComponent } from './doctor/doctor-settings/doctor-settings.component';
import { FirstKeyValuePipe } from './first-key-value.pipe';
import { FilterByStatusPipe } from './filter-by-status.pipe';
import { MapPickerComponent } from './doctor/map-picker/map-picker.component';
import { HeaderSettingsComponent } from './doctor/header-settings/header-settings.component';
import { NotificationSettingsComponent } from './doctor/notification-settings/notification-settings.component';
import { NotifiacationAlertComponent } from './shared/notifiacation-alert/notifiacation-alert.component';
import { MyPhoneNumbersComponent } from './doctor/my-phone-numbers/my-phone-numbers.component';
import { DokumentsComponent } from './doctor/dokuments/dokuments.component';
import { Spinner2Component } from './shared/spinner2/spinner2.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NotificationsComponent } from './shared/notifications/notifications.component';
import { NgxLoadersCssModule } from 'ngx-loaders-css';
import { NgxEditorModule } from 'ngx-editor';
import { NgSelectModule } from '@ng-select/ng-select';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ChartsModule } from 'angular-bootstrap-md';
import { ConsultationReportComponent } from './doctor/consultation-report/consultation-report.component';
import { FilterByVerificationPipe } from './filter-by-verification.pipe';
import { MedicalCertificationComponent } from './doctor/medical-certification/medical-certification.component';
import { QRCodeModule } from 'angularx-qrcode';
import { SafeUrlPipe } from './safe-url.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PatientsListComponent } from './doctor/patients-list/patients-list.component';
import { HomeComponent } from './home/home.component';
import { ConsultationTypesComponent } from './admin/consultation-types/consultation-types.component';
import { AddNewPatientComponent } from './doctor/patients/add-new-patient/add-new-patient.component';
import { DoctorAddConsultationComponent } from './doctor/doctor-add-consultation/doctor-add-consultation.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    DashboardAdminComponent,
    HeaderAdminComponent,
    SidebarAdminComponent,
    DoctorsComponent,
    SpinnerComponent,
    PlanningComponent,
    DashboardDoctorComponent,
    PlanningDoctorComponent,
    DoctorHeaderComponent,
    DoctorSidebarComponent,
    UnauthorizedComponent,
    DoctorSettingsComponent,
    FirstKeyValuePipe,
    FilterByStatusPipe,
    MapPickerComponent,
    HeaderSettingsComponent,
    NotificationSettingsComponent,
    NotifiacationAlertComponent,
    MyPhoneNumbersComponent,
    DokumentsComponent,

    Spinner2Component,
    NotificationsComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ConsultationReportComponent,
    FilterByVerificationPipe,
    MedicalCertificationComponent,
    SafeUrlPipe,
    PatientsListComponent,
    HomeComponent,
    ConsultationTypesComponent,
    AddNewPatientComponent,
    DoctorAddConsultationComponent,

    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    NgProgressModule,
    FullCalendarModule,
    NgxLoadersCssModule,
    NgxEditorModule,
    NgSelectModule,
    ChartsModule,
    NgProgressModule.withConfig({
      color: "#003d99"
    }),
    ToastrModule.forRoot({ // ToastrModule added
      timeOut: 1500,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
    }),
    NgProgressHttpModule,
    ReactiveFormsModule,
    FullCalendarModule,
    QRCodeModule,
    DragDropModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
