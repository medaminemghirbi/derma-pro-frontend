import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css'],
})
export class DoctorsComponent implements OnInit {
  doctors: any = [];
  last_import: any = [];
  filteredDoctors: any = [];

  isLoading: boolean = false;
  sortOrder: 'asc' | 'desc' = 'asc';
  messageErr: string = '';
  p: number = 1;
  searchedKeyword: string = ''; // Initialized as an empty string
  constructor(
    private usersService: AdminService,
    private toastr: ToastrService,
    private http: HttpClient,
    private route: Router,
    private auth: AuthService,
    private fb: FormBuilder
  ) {
    this.updateForm = this.fb.group({
      firstname: [''],
      lastname: [''],
      plan: [''],
      id: [''],
      customLimit: [null],
    });
  }
  isCollapsed: boolean[] = [];
  updateForm!: FormGroup;
  iscustomLimit: boolean = false; // To track if the selected plan is 'custom'
  doctorForm!: FormGroup;

  selectedPdfUrl: string | null = null;

  ngOnInit(): void {
    this.doctorForm = this.fb.group(
      {
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        gender: ['', Validators.required],
        location: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        password_confirmation: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
    this.loadDoctors(); // Load initial data
    this.isCollapsed = this.filteredDoctors.map(() => true);

    this.usersService.last_run().subscribe(
      (data) => {
        this.last_import = data;
      },
      (error) => {}
    );
  }
  // Toggle the expanded/collapsed state
  toggleDescription(index: number): void {
    this.isCollapsed[index] = !this.isCollapsed[index];
  }
  loadDoctors(): void {
    this.isLoading = true;
    this.usersService.getDoctors().subscribe(
      (data) => {
        this.doctors = data;
        console.log(this.doctors);
        this.filteredDoctors = data;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }
  sortByName(): void {
    if (this.sortOrder === 'asc') {
      this.filteredDoctors.sort(
        (
          a: { location: string; firstname: string },
          b: { location: any; firstname: string }
        ) => a.location.localeCompare(b.location)
      );
      this.sortOrder = 'desc';
    } else {
      this.filteredDoctors.sort(
        (
          a: { location: any; firstname: string },
          b: { location: string; firstname: string }
        ) => b.location.localeCompare(a.location)
      );
      this.sortOrder = 'asc';
    }
  }
  sortByCreatedAt(): void {
    if (this.sortOrder === 'asc') {
      this.filteredDoctors.sort(
        (a: { created_at: string }, b: { created_at: string }) =>
          new Date(a.created_at.split('.').reverse().join('-')).getTime() -
          new Date(b.created_at.split('.').reverse().join('-')).getTime()
      );
      this.sortOrder = 'desc';
    } else {
      this.filteredDoctors.sort(
        (a: { created_at: string }, b: { created_at: string }) =>
          new Date(b.created_at.split('.').reverse().join('-')).getTime() -
          new Date(a.created_at.split('.').reverse().join('-')).getTime()
      );
      this.sortOrder = 'asc';
    }
  }
  searchDoctors(): void {
    this.isLoading = true; // show spinner while "reloading"

    setTimeout(() => {
      const trimmedKeyword = this.searchedKeyword
        ? this.searchedKeyword.trim()
        : '';

      if (trimmedKeyword) {
        this.filteredDoctors = this.doctors.filter(
          (doctor: {
            firstname: string;
            location: string;
            lastname: string;
            email: string;
          }) => {
            const firstNameMatches =
              doctor.firstname &&
              doctor.firstname
                .toLowerCase()
                .includes(trimmedKeyword.toLowerCase());
            const lastNameMatches =
              doctor.lastname &&
              doctor.lastname
                .toLowerCase()
                .includes(trimmedKeyword.toLowerCase());
            const locationMatches =
              doctor.location &&
              doctor.location
                .toLowerCase()
                .includes(trimmedKeyword.toLowerCase());
            const emailMatches =
              doctor.email &&
              doctor.email
                .toLowerCase()
                .includes(trimmedKeyword.toLowerCase());
            return firstNameMatches || lastNameMatches || locationMatches || emailMatches;
          }
        );
      } else {
        this.filteredDoctors = [...this.doctors];
      }

      this.p = 1; // reset pagination
      this.isLoading = false; // hide spinner after reload
    }, 300); // small delay so spinner is visible
  }

  activateCompte(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Activate it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersService.activateCompte(id).subscribe(
          (response) => {
            // Display success message
            Swal.fire('Account Activated Successfully!', '', 'success').then(
              () => {
                // Find the index of the user and update the corresponding row
                const userIndex = this.filteredDoctors.findIndex(
                  (user: { id: any }) => user.id === id
                );
                if (userIndex !== -1) {
                  this.filteredDoctors[userIndex].email_confirmed = true;

                  this.filteredDoctors[userIndex].confirm_token = null;
                  // Optionally, update any other UI elements related to this user
                }
              }
            );
          },
          (error) => {
            // Handle errors if any
            Swal.fire(
              'Error!',
              'There was a problem activating the account.',
              'error'
            );
          }
        );
      }
    });
  }
  opendataCSV() {
    Swal.fire({
      title: 'Attention !',
      html: `
        <strong>Cettre action va scrapper des informations sur les docteurs et les importer depuis un fichier CSV.</strong><br/>
        <span style="font-size: larger;">Cela pourrait prendre un certain temps. <br> Êtes-vous sûr de vouloir continuer ?</span><br/><br/>
      
      `,
      icon: 'warning',
      showDenyButton: true,
      confirmButtonText: 'Oui, continuer',
      denyButtonText: 'Non, annuler',
      width: '800px',
      padding: '60px',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;

        // Pass the selectedOption to your backend or use it in some way
        this.usersService.reloadData().subscribe(
          (data) => {
            this.isLoading = false;
            this.doctors = data.doctor; // Assuming `doctor` is a field in `data`
            Swal.fire({
              title: 'Succès !',
              text: 'Les docteurs ont été importés avec succès !',
              icon: 'success',
              confirmButtonText: 'OK',
              width: '400px',
            }).then(() => {
              // Reload the page after the successful import
              window.location.reload();
            });
          },
          (err: HttpErrorResponse) => {
            this.isLoading = false;
            Swal.fire({
              title: 'Erreur',
              text: "Une erreur est survenue lors de l'importation des données.",
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        );
      } else if (result.isDenied) {
        Swal.fire({
          title: 'Annulé',
          text: "Aucune modification n'a été sauvegardée.",
          icon: 'info',
          confirmButtonText: 'OK',
        });
      }
    });
  }
  refreshDoctors(): void {
    this.loadDoctors();
  }
  delete(id: any, i: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Archive it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersService.ArchiveDoctor(id).subscribe(
          (response) => {
            // If the deletion is successful, remove the user from the list
            this.doctors.splice(i, 1);
            Swal.fire('Deleted!', 'User has been Archived.', 'success');
          },
          (error) => {
            // If there's an error, display the error message
            Swal.fire(
              'Error!',
              "You can't archvie user with active contract",
              'error'
            );
          }
        );
      }
    });
  }
  verifyDoctor(): void {
    if (!this.selectedPdfUrl) return;

    this.http
      .patch(environment.urlBackend + 'api/v1/verify_doctor/', {
        pdf_url: this.selectedPdfUrl,
      })
      .subscribe({
        next: () => {
          // Reload the page to reflect the updated verification status
          window.location.reload();
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
          this.messageErr = 'Failed to verify doctor.';
        },
      });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value ===
      form.get('password_confirmation')?.value
      ? null
      : { mismatch: true };
  }

async onSubmit() {
  if (this.doctorForm.valid) {
    console.log(this.doctorForm.value);

    const userData = {
      registration: {
        firstname: this.doctorForm.value.firstname,
        lastname: this.doctorForm.value.lastname,
        email: this.doctorForm.value.email,
        gender: this.doctorForm.value.gender,
        location: this.doctorForm.value.location,
        password: this.doctorForm.value.password,
        password_confirmation: this.doctorForm.value.password_confirmation
      }
    };

    // Disable button via Angular state
    this.isLoading = true;

    try {
      const response = await this.auth.register(userData).toPromise();
      this.messageErr = '';

      await Swal.fire('Whooa!', 'Patient successfully created!!', 'success');

      window.location.reload()
    } catch (error) {
      console.error(error);
      this.messageErr = 'Registration failed, please try again';
    } finally {
      // Re-enable the button
      this.isLoading = false;
    }
  }
}

}
