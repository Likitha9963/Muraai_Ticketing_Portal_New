import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TicketService, TicketCounts } from '../../services/ticket.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  searchQuery = '';
  showCreateDropdown = false;
  showTicketsDropdown = false;
  showNotifications = false;
  showUserMenu = false;
  isDarkMode = false;
  
  ticketCounts: TicketCounts = {
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

  notifications = [
    { id: 1, message: 'New ticket assigned to you', time: '2 minutes ago', unread: true },
    { id: 2, message: 'Ticket #123 has been resolved', time: '1 hour ago', unread: true },
    { id: 3, message: 'Weekly report is ready', time: '3 hours ago', unread: false }
  ];

  createOptions = [
    { label: 'Ticket', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
    { label: 'Contact', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { label: 'Report', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }
  ];

  ticketOptions = [
    { label: 'All Tickets', value: 'all', count: 0 },
    { label: 'All Pending Tickets', value: 'pending', count: 0 },
    { label: 'All Resolution Overdue Tickets', value: 'resolution-overdue', count: 0 },
    { label: 'All Response Overdue Tickets', value: 'response-overdue', count: 0 },
    { label: 'All Tickets Resolution Due', value: 'resolution-due', count: 0 },
    { label: 'All Unassigned Tickets', value: 'unassigned', count: 0 },
    { label: 'All Unsolved Tickets', value: 'unsolved', count: 0 },
    { label: 'My Pending Tickets', value: 'my-pending', count: 0 }
  ];

  constructor(private router: Router, private ticketService: TicketService) {}

  ngOnInit(): void {
    this.loadTicketCounts();
    this.loadTheme();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTicketCounts(): void {
    this.ticketService.getCounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(counts => {
        this.ticketCounts = counts;
        this.updateTicketOptionCounts();
      });
  }

  private updateTicketOptionCounts(): void {
    this.ticketOptions = [
      { label: 'All Tickets', value: 'all', count: this.ticketCounts.total },
      { label: 'All Pending Tickets', value: 'pending', count: this.ticketCounts.pending },
      { label: 'All Resolution Overdue Tickets', value: 'resolution-overdue', count: this.ticketCounts.resolutionDue },
      { label: 'All Response Overdue Tickets', value: 'response-overdue', count: this.ticketCounts.responseDue },
      { label: 'All Tickets Resolution Due', value: 'resolution-due', count: this.ticketCounts.resolutionDue },
      { label: 'All Unassigned Tickets', value: 'unassigned', count: 0 },
      { label: 'All Unsolved Tickets', value: 'unsolved', count: this.ticketCounts.pending + this.ticketCounts.open },
      { label: 'My Pending Tickets', value: 'my-pending', count: this.ticketCounts.pending }
    ];
  }

  onSearch() {
    console.log('Searching for:', this.searchQuery);
  }

  toggleCreateDropdown() {
    this.showCreateDropdown = !this.showCreateDropdown;
    this.showTicketsDropdown = false;
    this.showNotifications = false;
    this.showUserMenu = false;
  }

  toggleTicketsDropdown() {
    this.showTicketsDropdown = !this.showTicketsDropdown;
    this.showCreateDropdown = false;
    this.showNotifications = false;
    this.showUserMenu = false;
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showCreateDropdown = false;
    this.showTicketsDropdown = false;
    this.showUserMenu = false;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    this.showCreateDropdown = false;
    this.showTicketsDropdown = false;
    this.showNotifications = false;
  }

  createItem(type: string) {
    console.log('Creating:', type);
    this.showCreateDropdown = false;
    
    if (type === 'Ticket') {
      this.router.navigate(['/tickets/create']);
    }
  }

  selectTicketOption(option: string) {
    this.showTicketsDropdown = false;
    this.router.navigate(['/tickets'], { queryParams: { filter: option } });
  }

  // ✅ Updated Theme Toggle
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.saveTheme();
    this.applyTheme();
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.applyTheme();
  }

  private saveTheme(): void {
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  private applyTheme(): void {
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');   // ✅ Use dark-theme class
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  markAsRead(notificationId: number) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.unread = false;
    }
  }

  get unreadCount() {
    return this.notifications.filter(n => n.unread).length;
  }

  toggleMobileMenu() {
    console.log('Toggle mobile menu');
  }
}
