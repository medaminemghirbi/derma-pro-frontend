import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-new-patient',
  templateUrl: './add-new-patient.component.html',
  styleUrls: ['./add-new-patient.component.css'],
})
export class AddNewPatientComponent implements OnInit {
  patientForm!: FormGroup;
  currentStep: number = 1;
  locations: any = [];
  messageErr = '';
  currentUser: any;
  submitted = false;
  constructor(
    private usersService: AdminService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService, 
    private auth: AuthService
  ) {
    this.patientForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{8,15}$')],
      ],
      email: ['', [Validators.email]],
      birthday: ['', Validators.required],
      gender: ['', Validators.required],
      location: ['', Validators.required],
      address: ['', [Validators.required, Validators.minLength(5)]],
      civil_status: ['', [Validators.required]],
      medical_history: ['', [Validators.required]],

      doctor_id: [''],
    });
  }

  async ngOnInit(): Promise<void> {
    this.currentUser = this.auth.getcurrentuser();
    try {
      this.locations = await this.usersService.getAllLocations().toPromise();
      this.locations.sort((a: any, b: any) => a.name.localeCompare(b.name));
    } catch (error) {
      this.messageErr = "We couldn't find any locations in our database.";
    }
  }
nextStep(): void {
  if (this.currentStep === 1) {
    debugger
    if (this.patientForm.valid) {
      this.currentStep = 2;
      this.activateTab('step2');
    } else {
      this.patientForm.markAllAsTouched();
    }
  }
}

  previousStep(): void {
    if (this.currentStep === 2) {
      this.currentStep = 1;
      this.activateTab('step1');
    }
  }

  activateTab(tabId: string): void {
    const triggerEl = document.querySelector(`#${tabId}-tab`);
    if (triggerEl) {
      (triggerEl as HTMLElement).click();
    }
  }

  async save() {
    this.submitted = true;
    if (this.patientForm.valid) {
      const formData = this.patientForm.value;
      const userData = {
        registration: {
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          gender: formData.gender,
          location: formData.location,
          phone_number: formData.phoneNumber,
          address: formData.address,
          birthday: formData.birthday,
          doctor_id: this.currentUser.id,
        },
      };
      console.log('Form submitted:', formData);
      // Submit data here if needed
      // Disable register button and show loading spinner
      let registerButton = document.getElementById(
        'registerButton'
      ) as HTMLButtonElement;
      registerButton.disabled = true;
      registerButton.innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';

      try {
        const response = await this.auth.register(userData).toPromise();
        this.messageErr = '';

        Swal.fire('Whooa!', 'Patient successfully created!!', 'success').then(
          () => {
            registerButton.disabled = false;
            registerButton.innerHTML = 'Register';
            this.router.navigate(['/doctor/patients']);
          }
        );
      } catch (error) {
        console.log(error);

        // Enable the register button if there's an error
        registerButton.disabled = false;
        registerButton.innerHTML = 'Register';
      }
    } else {
      Object.keys(this.patientForm.controls).forEach((key) => {
        const control = this.patientForm.get(key);
        if (control && control.invalid) {
          console.log(`Field '${key}' is invalid. Errors:`, control.errors);
        }
      });
    }
  }

  get f() {
    return this.patientForm.controls;
  }
}
