import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.css']
})
export class HeaderAdminComponent implements OnInit {

  currentuser: any;
  userType: any;
  
  constructor(
    private Auth: AuthService,
    private router: Router,
    private adminService: AdminService
  ) {
    this.currentuser = this.Auth.getcurrentuser();
    this.userType = sessionStorage.getItem('user_type') || 'Guest';
  }

  ngOnInit(): void {
  }

  // Settings and profile methods
  openSettings() {
    // Navigate to admin settings or show settings modal
    console.log('Opening settings...');
    // You can implement this based on your needs
  }

  openProfileSettings() {
    // Navigate to profile settings
    console.log('Opening profile settings...');
    // You can implement this based on your needs
  }

  openAccountSettings() {
    // Navigate to account settings
    console.log('Opening account settings...');
    // You can implement this based on your needs
  }

  // Notifications
  viewAllNotifications() {
    // Navigate to notifications page or load all notifications
    if (this.currentuser && this.currentuser.id) {
      this.adminService.getNotifications(this.currentuser.id).subscribe({
        next: (notifications) => {
          console.log('All notifications:', notifications);
          // You can show these in a modal or navigate to a notifications page
        },
        error: (error) => {
          console.error('Error loading notifications:', error);
        }
      });
    }
  }

  // Transactions
  viewTransactions() {
    // Navigate to transactions view
    console.log('Viewing transactions...');
    // You can implement this based on your admin needs
  }

  // Logout
  logout() {
    this.Auth.logout().subscribe({
      next: () => {
        sessionStorage.clear();
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error during logout:', error);
        // Force logout even if API fails
        sessionStorage.clear();
        this.router.navigate(['/']);
      }
    });
  }
}
