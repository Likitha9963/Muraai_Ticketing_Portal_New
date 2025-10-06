import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TicketService, Ticket, TicketMessage } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css']
})
export class TicketDetailComponent implements OnInit, OnDestroy {
  @Input() ticketId: string = '';
  @Output() closed = new EventEmitter<void>();

  ticket: Ticket | null = null;
  replyContent: string = '';
  isSubmittingReply: boolean = false;
  activeTab: string = 'messages';
  
  private destroy$ = new Subject<void>();

  tabs = [
    { id: 'messages', label: 'Messages', count: 0 },
    { id: 'links', label: 'Links', count: 0 },
    { id: 'activities', label: 'Activities', count: 0 },
    { id: 'approvals', label: 'Approvals', count: 0 },
    { id: 'worklog', label: 'Worklog', count: 0 }
  ];

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    if (this.ticketId) {
      this.loadTicket();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTicket(): void {
    this.ticketService.getTicketById(this.ticketId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(ticket => {
        this.ticket = ticket || null;
        if (this.ticket) {
          this.updateTabCounts();
        }
      });
  }

  private updateTabCounts(): void {
    if (!this.ticket) return;
    
    this.tabs = this.tabs.map(tab => {
      switch (tab.id) {
        case 'messages':
          return { ...tab, count: this.ticket!.messages.length };
        case 'activities':
          return { ...tab, count: this.ticket!.messages.length + 2 }; // Messages + status changes
        default:
          return { ...tab, count: 0 };
      }
    });
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  onSubmitReply(): void {
    if (!this.ticket || !this.replyContent.trim() || this.isSubmittingReply) {
      return;
    }

    this.isSubmittingReply = true;

    this.ticketService.addMessageToTicket(
      this.ticket.id,
      this.replyContent.trim(),
      'agent1', // Current agent ID
      'Likitha', // Current agent name
      'LI', // Current agent initials
      false // Not internal
    ).pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (message) => {
        if (message) {
          this.replyContent = '';
          this.loadTicket(); // Reload to get updated ticket
        }
        this.isSubmittingReply = false;
      },
      error: (error) => {
        console.error('Error submitting reply:', error);
        this.isSubmittingReply = false;
      }
    });
  }

  onClose(): void {
    this.closed.emit();
  }

  updateTicketStatus(newStatus: string): void {
    if (!this.ticket) return;

    this.ticketService.updateTicket(this.ticket.id, { 
      status: newStatus as any 
    }).pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (updatedTicket) => {
        if (updatedTicket) {
          this.ticket = updatedTicket;
        }
      },
      error: (error) => {
        console.error('Error updating ticket status:', error);
      }
    });
  }

  updateTicketPriority(newPriority: string): void {
    if (!this.ticket) return;

    this.ticketService.updateTicket(this.ticket.id, { 
      priority: newPriority as any 
    }).pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (updatedTicket) => {
        if (updatedTicket) {
          this.ticket = updatedTicket;
        }
      },
      error: (error) => {
        console.error('Error updating ticket priority:', error);
      }
    });
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

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  trackByMessageId(index: number, message: TicketMessage): string {
    return message.id;
  }

  onStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target && target.value) {
      this.updateTicketStatus(target.value);
    }
  }

  onPriorityChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target && target.value) {
      this.updateTicketPriority(target.value);
    }
  }
}
