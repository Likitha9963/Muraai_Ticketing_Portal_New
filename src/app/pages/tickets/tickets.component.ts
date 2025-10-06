import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TicketService, Ticket } from '../../services/ticket.service';
import { TicketCreateComponent } from '../../components/ticket-create/ticket-create.component';
import { TicketDetailComponent } from '../../components/ticket-detail/ticket-detail.component';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule, TicketCreateComponent, TicketDetailComponent],
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit, OnDestroy {
  searchQuery = '';
  currentSort = 'Created - Desc';
  selectedTicket: Ticket | null = null;
  selectedTicketId: string = '';
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  showCreateTicket = false;
  showTicketDetail = false;
  showAllViews = true;
  currentFilter = 'all';
  
  private destroy$ = new Subject<void>();

  views = [
    { name: 'All Pending Tickets', count: 0 },
    { name: 'All Resolution Overdue Tickets', count: 0 },
    { name: 'All Response Overdue Tickets', count: 0 },
    { name: 'All Tickets', count: 0 },
    { name: 'All Tickets Resolution Due Today', count: 0 },
    { name: 'All Unassigned Tickets', count: 0 },
    { name: 'All Unsolved Tickets', count: 0 },
    { name: 'My Pending Tickets', count: 0 }
  ];

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute
  ) {}
  currentPage = 1;
totalPages = 1; // Update this dynamically based on your data

goToPreviousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.loadPageData(this.currentPage);
  }
}

goToNextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.loadPageData(this.currentPage);
  }
}

loadPageData(page: number) {
  // Fetch table/ticket data for the specified page
}


  ngOnInit(): void {
    this.loadTickets();
    this.loadCounts();
    
    // Listen for query parameters to handle filtering
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['filter']) {
          this.currentFilter = params['filter'];
          this.applyFiltersAndSort();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTickets(): void {
    this.ticketService.getTickets()
      .pipe(takeUntil(this.destroy$))
      .subscribe(tickets => {
        this.tickets = tickets;
        this.applyFiltersAndSort();
      });
  }

  private loadCounts(): void {
    this.ticketService.getCounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(counts => {
        this.views = [
          { name: 'All Pending Tickets', count: counts.pending },
          { name: 'All Resolution Overdue Tickets', count: counts.resolutionDue },
          { name: 'All Response Overdue Tickets', count: counts.responseDue },
          { name: 'All Tickets', count: counts.total },
          { name: 'All Tickets Resolution Due Today', count: 0 },
          { name: 'All Unassigned Tickets', count: 0 },
          { name: 'All Unsolved Tickets', count: counts.open + counts.pending },
          { name: 'My Pending Tickets', count: counts.pending }
        ];
      });
  }

  private applyFiltersAndSort(): void {
    let filtered = [...this.tickets];

    // Apply filter based on current filter type
    filtered = this.applyFilter(filtered);

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(query) ||
        ticket.requester.name.toLowerCase().includes(query) ||
        ticket.requester.email.toLowerCase().includes(query) ||
        ticket.id.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered = this.ticketService.sortTickets(filtered, this.currentSort);

    this.filteredTickets = filtered;
  }

  private applyFilter(tickets: Ticket[]): Ticket[] {
    const now = new Date();
    
    switch (this.currentFilter) {
      case 'pending':
        return tickets.filter(ticket => ticket.status === 'Pending');
      
      case 'resolution-overdue':
        return tickets.filter(ticket => 
          ticket.resolutionDue && 
          ticket.resolutionDue < now && 
          ticket.status !== 'Resolved' && 
          ticket.status !== 'Closed'
        );
      
      case 'response-overdue':
        return tickets.filter(ticket => {
          const lastMessage = ticket.messages[ticket.messages.length - 1];
          if (!lastMessage) return false;
          const timeDiff = now.getTime() - lastMessage.createdAt.getTime();
          const hoursDiff = timeDiff / (1000 * 3600);
          return hoursDiff > 24 && 
                 lastMessage.author.type === 'customer' && 
                 ticket.status !== 'Resolved' && 
                 ticket.status !== 'Closed';
        });
      
      case 'resolution-due':
        return tickets.filter(ticket => 
          ticket.resolutionDue && 
          ticket.resolutionDue >= now && 
          ticket.status !== 'Resolved' && 
          ticket.status !== 'Closed'
        );
      
      case 'unassigned':
        return tickets.filter(ticket => 
          ticket.assignee.name === 'Auto Assign' || 
          ticket.assignee.name === 'Unassigned'
        );
      
      case 'unsolved':
        return tickets.filter(ticket => 
          ticket.status === 'Pending' || ticket.status === 'Open' || ticket.status === 'On Hold'
        );
      
      case 'my-pending':
        return tickets.filter(ticket => 
          ticket.status === 'Pending' && 
          ticket.assignee.name === 'Likitha'
        );
      
      case 'all':
      default:
        return tickets;
    }
  }

  selectTicket(ticket: Ticket): void {
    this.selectedTicket = ticket;
    this.selectedTicketId = ticket.id;
    this.showTicketDetail = true;
  }

  onSearch(): void {
    this.applyFiltersAndSort();
  }

  onSortChange(sortOption: string): void {
    this.currentSort = sortOption;
    this.applyFiltersAndSort();
  }

  onCreateTicket(): void {
    this.showCreateTicket = true;
  }

  onTicketCreated(ticket: Ticket): void {
    this.showCreateTicket = false;
    // Tickets will be automatically updated via the service subscription
  }

  onCreateTicketCancelled(): void {
    this.showCreateTicket = false;
  }

  onTicketDetailClosed(): void {
    this.showTicketDetail = false;
    this.selectedTicket = null;
    this.selectedTicketId = '';
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }

  trackByTicketId(index: number, ticket: Ticket): string {
    return ticket.id;
  }

  toggleAllViews() {
    this.showAllViews = !this.showAllViews;
  }

  selectView(view: any) {
    console.log('Selected view:', view.name);
    // This method is for the sidebar view selection
    // The main filtering is handled by the navbar dropdown
  }

  getCurrentFilterLabel(): string {
    switch (this.currentFilter) {
      case 'pending':
        return 'All Pending Tickets';
      case 'resolution-overdue':
        return 'All Resolution Overdue Tickets';
      case 'response-overdue':
        return 'All Response Overdue Tickets';
      case 'resolution-due':
        return 'All Tickets Resolution Due';
      case 'unassigned':
        return 'All Unassigned Tickets';
      case 'unsolved':
        return 'All Unsolved Tickets';
      case 'my-pending':
        return 'My Pending Tickets';
      case 'all':
      default:
        return 'All Tickets';
    }
  }
}