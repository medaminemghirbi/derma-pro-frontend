import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
@Component({
  selector: 'app-consultation-types',
  templateUrl: './consultation-types.component.html',
  styleUrls: ['./consultation-types.component.css']
})
export class ConsultationTypesComponent implements OnInit {
  ConsultationTypes:any = []
  filterdConsultationTypes:any = []

  isLoading: boolean = false;
  sortOrder: 'asc' | 'desc' = 'asc';
  messageErr: string = '';
  p:number = 1 ;
  searchedKeyword: string = ''; // Initialized as an empty string
  constructor(private usersService: AdminService, private route: Router) { }
  isCollapsed: boolean[] = [];

  ngOnInit(): void {
    this.loadConsultationTypes(); // Load initial data
    this.isCollapsed = this.filterdConsultationTypes.map(() => true);
  }
    // Toggle the expanded/collapsed state
    toggleDescription(index: number): void {
      this.isCollapsed[index] = !this.isCollapsed[index];
    }
  loadConsultationTypes(): void {
    this.isLoading = true;
    this.usersService.getConsultationTypes().subscribe(data => {
      this.ConsultationTypes = data;
      this.filterdConsultationTypes = data;
      this.isLoading = false;
    }, error => {
      console.error('Error fetching ConsultationTypes', error);
      this.isLoading = false;
    });
  }
  sortByName(): void {
    if (this.sortOrder === 'asc') {
      this.filterdConsultationTypes.sort((a: { location: string,firstname:string }, b: { location: string, firstname:string }) => a.firstname.localeCompare(b.firstname));
      this.sortOrder = 'desc';
    } else {
      this.filterdConsultationTypes.sort((a: { location: string, firstname:string }, b: { location: string, firstname:string }) => b.firstname.localeCompare(a.firstname));
      this.sortOrder = 'asc';
    }
  }
  searchConsultationTypes(): void {
    const trimmedKeyword = this.searchedKeyword ? this.searchedKeyword.trim() : '';
  
    if (trimmedKeyword) {
      this.filterdConsultationTypes = this.ConsultationTypes.filter((doctor: { firstname: string, lastname:string  }) =>
        doctor.firstname.toLowerCase().includes(trimmedKeyword.toLowerCase()) ||
        doctor.lastname.toLowerCase().includes(trimmedKeyword.toLowerCase())

      );
    } else {
      this.filterdConsultationTypes = [...this.ConsultationTypes];
    }
  
    this.p = 1;
  }

  refreshConsultationTypes(): void {
    this.loadConsultationTypes();
  }

}
