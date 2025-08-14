import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-doctor-header',
  templateUrl: './doctor-header.component.html',
  styleUrls: ['./doctor-header.component.css']
})
export class DoctorHeaderComponent implements OnInit {
  currentuser : any
  notifications:any
  constructor(private auth : AuthService, private admin:AdminService) { }
  qr_url!:string;
  ngOnInit(): void {
    this.currentuser = this.auth.getcurrentuser();
    this.notifications = this.admin.getNotifications(this.currentuser.id);
    console.log(this.notifications)
    this.qr_url = sessionStorage.getItem('qr_url')!;
    console.log(this.qr_url)
  }

  toggleFullScreen(): void {
  const elem = document.documentElement;

  if (!document.fullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if ((elem as any).webkitRequestFullscreen) { /* Safari */
      (elem as any).webkitRequestFullscreen();
    } else if ((elem as any).msRequestFullscreen) { /* IE11 */
      (elem as any).msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) { /* Safari */
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) { /* IE11 */
      (document as any).msExitFullscreen();
    }
  }
}

}
