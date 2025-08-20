import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-sidebar-admin',
  templateUrl: './sidebar-admin.component.html',
  styleUrls: ['./sidebar-admin.component.css']
})
export class SidebarAdminComponent implements OnInit {

  constructor(
    private router: Router,
    private auth: AuthService,
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
  }

  logout(){
    this.auth.logout();
    this.router.navigate(['/']);
  }

  // Navigate to statistics view and load data
  viewStatistics() {
    this.router.navigate(['/admin/dashboard']).then(() => {
      // The dashboard component should handle loading statistics
    });
  }

  // Navigate to reports view
  viewReports() {
    this.router.navigate(['/admin/dashboard']).then(() => {
      // The dashboard component should handle reports
    });
  }

  // Reload system data
  reloadSystemData() {
    this.adminService.reloadData().subscribe({
      next: (response) => {
        console.log('System data reloaded successfully', response);
        // You could add a toast notification here
        alert('System data reloaded successfully!');
      },
      error: (error) => {
        console.error('Error reloading system data', error);
        alert('Error reloading system data. Please try again.');
      }
    });
  }

  // View system status (last run information)
  viewSystemStatus() {
    this.adminService.last_run().subscribe({
      next: (response) => {
        console.log('System status:', response);
        // You could show this in a modal or navigate to a status page
        alert(`Last system run: ${JSON.stringify(response)}`);
      },
      error: (error) => {
        console.error('Error fetching system status', error);
        alert('Error fetching system status.');
      }
    });
  }
}
