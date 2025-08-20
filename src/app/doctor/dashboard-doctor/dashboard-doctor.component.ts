import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard-doctor',
  templateUrl: './dashboard-doctor.component.html',
  styleUrls: ['./dashboard-doctor.component.css']
})
export class DashboardDoctorComponent implements OnInit, OnDestroy {
  trialDays = 14;
  daysLeft = 0;
  hoursLeft = 0;
  minutesLeft = 0;
  secondsLeft = 0;
  progress = 0;
  showTrialBar = true;

  private timer: any;
  private endDate!: Date;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    const currentUser = this.auth.getcurrentuser();
    if (currentUser?.account_access_granted_at) {
      const startDate = new Date(currentUser.account_access_granted_at);
      this.endDate = new Date(startDate.getTime() + this.trialDays * 24 * 60 * 60 * 1000);
      this.updateCountdown();
      this.timer = setInterval(() => this.updateCountdown(), 1000);
    }
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private updateCountdown() {
    const now = new Date().getTime();
    const diff = this.endDate.getTime() - now;

    if (diff <= 0) {
      this.daysLeft = this.hoursLeft = this.minutesLeft = this.secondsLeft = 0;
      this.progress = 100;
      clearInterval(this.timer);
      return;
    }

    this.daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
    this.hoursLeft = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    this.secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);

    const elapsedDays = this.trialDays - this.daysLeft - (this.hoursLeft > 0 || this.minutesLeft > 0 || this.secondsLeft > 0 ? 0 : 1);
    this.progress = Math.min(100, (elapsedDays / this.trialDays) * 100);
  }

  closeTrialBar() {
    this.showTrialBar = false;
  }
}
