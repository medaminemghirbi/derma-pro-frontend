import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-notifiacation-alert',
  templateUrl: './notifiacation-alert.component.html',
  styleUrls: ['./notifiacation-alert.component.css']
})
export class NotifiacationAlertComponent implements OnInit {
  currentuser: any;
  ws: WebSocket | undefined;

  constructor(
    private cdr: ChangeDetectorRef,
    private Auth: AuthService,
    private toastr: ToastrService
  ) {
    this.currentuser = this.Auth.getcurrentuser();
  }

  ngOnInit(): void {
    this.initializeWebSocket();
  }

  initializeWebSocket(): void {
    if (this.ws) return;

    this.ws = new WebSocket(
      `${environment.urlBackend.replace(/^http(s)?:\/\//, match => match === 'https://' ? 'wss://' : 'ws://').replace(/\/$/, '')}/cable`
    );

    this.ws.onopen = () => {
      console.log('WebSocket connected.');
      this.ws?.send(JSON.stringify({
        command: 'subscribe',
        identifier: JSON.stringify({ channel: 'DocumentChannel', user_id: this.currentuser.id })
      }));
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type !== 'confirm_subscription' && data.message) {
        this.handleNewNotification(data.message);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket closed. Reconnecting...');
      setTimeout(() => this.initializeWebSocket(), 1000);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  handleNewNotification(data: any): void {
    if (data.subject === 'document_due' && data.message) {
      this.toastr.success(data.message, '📄 Document Reminder', {
        timeOut: 4000
      });
      this.cdr.detectChanges();
    }
  }
}
