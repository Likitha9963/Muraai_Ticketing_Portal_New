import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { TicketService, TicketCounts } from '../../services/ticket.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  trialDaysLeft = 14;
  supportEmail = 'support@yourcompany.com';
  customerPortalUrl = 'https://yourcompany.bolddesk.com';

  stats: TicketCounts = {
    pending: 0,
    open: 0,
    resolved: 0,
    closed: 0,
    onHold: 0,
    resolutionDue: 0,
    responseDue: 0,
    created: 0,
    requested: 0,
    total: 0
  };

  private destroy$ = new Subject<void>();

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadStats(): void {
    this.ticketService.getCounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(counts => {
        this.stats = counts;
      });
  }

  purchaseNow() {
    console.log('Purchase now clicked');
  }

  requestDemo() {
    console.log('Request demo clicked');
  }

  contactSupport() {
    console.log('Contact support clicked');
  }

  getStarted() {
    console.log('Get started clicked');
  }

  changeEmail() {
    console.log('Change email clicked');
  }

  changePortalUrl() {
    console.log('Change portal URL clicked');
  }
}