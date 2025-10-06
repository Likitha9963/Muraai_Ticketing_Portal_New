import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'Pending' | 'Resolved' | 'Closed' | 'On Hold';
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  type: string;
  category: string;
  tags: string[];
  requester: {
    id: string;
    name: string;
    email: string;
    initials: string;
    contactGroup?: string;
    phoneNumber?: string;
    mobileNumber?: string;
    timeZone?: string;
  };
  assignee: {
    id: string;
    name: string;
  };
  watchers: string[];
  visibility: 'Public' | 'Private' | 'Internal';
   department?: string;
  createdAt: Date;
  updatedAt: Date;
  resolutionDue?: Date;
  messages: TicketMessage[];
  isPrivate: boolean;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  author: {
    id: string;
    name: string;
    initials: string;
    type: 'agent' | 'customer';
  };
  content: string;
  createdAt: Date;
  isInternal: boolean;
}

export interface TicketCounts {
  pending: number;
  open: number;
  resolved: number;
  closed: number;
  onHold: number;
  resolutionDue: number;
  responseDue: number;
  created: number;
  requested: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly STORAGE_KEY = 'bolddesk_tickets';
  private readonly MESSAGE_STORAGE_KEY = 'bolddesk_messages';
  
  private ticketsSubject = new BehaviorSubject<Ticket[]>([]);
  private countsSubject = new BehaviorSubject<TicketCounts>(this.getInitialCounts());

  public tickets$ = this.ticketsSubject.asObservable();
  public counts$ = this.countsSubject.asObservable();

  constructor() {
    this.loadTicketsFromStorage();
  }

  private getInitialCounts(): TicketCounts {
    return {
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
  }

  private loadTicketsFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const tickets: Ticket[] = JSON.parse(stored).map((ticket: any) => ({
          ...ticket,
          createdAt: new Date(ticket.createdAt),
          updatedAt: new Date(ticket.updatedAt),
          resolutionDue: ticket.resolutionDue ? new Date(ticket.resolutionDue) : undefined,
          messages: ticket.messages?.map((msg: any) => ({
            ...msg,
            createdAt: new Date(msg.createdAt)
          })) || []
        }));
        this.ticketsSubject.next(tickets);
        this.updateCounts(tickets);
      } else {
        // Initialize with sample data if no data exists
        this.initializeSampleData();
      }
    } catch (error) {
      console.error('Error loading tickets from storage:', error);
      this.initializeSampleData();
    }
  }

  private saveTicketsToStorage(tickets: Ticket[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tickets));
    } catch (error) {
      console.error('Error saving tickets to storage:', error);
    }
  }

  private updateCounts(tickets: Ticket[]): void {
    const now = new Date();
    const counts: TicketCounts = {
      pending: tickets.filter(t => t.status === 'Pending').length,
      open: tickets.filter(t => t.status === 'Open').length,
      resolved: tickets.filter(t => t.status === 'Resolved').length,
      closed: tickets.filter(t => t.status === 'Closed').length,
      onHold: tickets.filter(t => t.status === 'On Hold').length,
      resolutionDue: tickets.filter(t => t.resolutionDue && t.resolutionDue < now && t.status !== 'Resolved' && t.status !== 'Closed').length,
      responseDue: tickets.filter(t => {
        const lastMessage = t.messages[t.messages.length - 1];
        if (!lastMessage) return false;
        const timeDiff = now.getTime() - lastMessage.createdAt.getTime();
        const hoursDiff = timeDiff / (1000 * 3600);
        return hoursDiff > 24 && lastMessage.author.type === 'customer' && t.status !== 'Resolved' && t.status !== 'Closed';
      }).length,
      created: tickets.length,
      requested: tickets.length,
      total: tickets.length
    };
    this.countsSubject.next(counts);
  }

  private initializeSampleData(): void {
    const sampleTickets: Ticket[] = [
      {
        id: '1',
        title: 'Unable to access dashboard after login',
        description: 'I am experiencing issues accessing the main dashboard after successful login. The page keeps loading indefinitely.',
        status: 'Open',
        priority: 'High',
        type: 'Bug',
        category: 'Technical',
        tags: ['login', 'dashboard', 'access'],
        requester: {
          id: 'user1',
          name: 'John Smith',
          email: 'john.smith@example.com',
          initials: 'JS',
          contactGroup: 'Premium Support',
          timeZone: 'Eastern Standard Time'
        },
        assignee: {
          id: 'agent1',
          name: 'Likitha'
        },
        watchers: [],
        visibility: 'Public',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        resolutionDue: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        messages: [
          {
            id: 'msg1',
            ticketId: '1',
            author: {
              id: 'user1',
              name: 'John Smith',
              initials: 'JS',
              type: 'customer'
            },
            content: 'I am experiencing issues accessing the main dashboard after successful login. The page keeps loading indefinitely.',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            isInternal: false
          }
        ],
        isPrivate: false
      },
      {
        id: '2',
        title: 'Password reset email not received',
        description: 'I requested a password reset but haven\'t received the email yet. Please help.',
        status: 'Pending',
        priority: 'Normal',
        type: 'Request',
        category: 'Account',
        tags: ['password', 'email', 'reset'],
        requester: {
          id: 'user2',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@example.com',
          initials: 'SJ'
        },
        assignee: {
          id: 'agent1',
          name: 'Likitha'
        },
        watchers: [],
        visibility: 'Public',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        messages: [
          {
            id: 'msg2',
            ticketId: '2',
            author: {
              id: 'user2',
              name: 'Sarah Johnson',
              initials: 'SJ',
              type: 'customer'
            },
            content: 'I requested a password reset but haven\'t received the email yet. Please help.',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            isInternal: false
          }
        ],
        isPrivate: false
      },
      {
        id: '3',
        title: 'Feature request: Dark mode support',
        description: 'Would love to see dark mode support in the application for better user experience.',
        status: 'Open',
        priority: 'Low',
        type: 'Feature Request',
        category: 'Enhancement',
        tags: ['dark-mode', 'ui', 'feature'],
        requester: {
          id: 'user3',
          name: 'Mike Davis',
          email: 'mike.davis@example.com',
          initials: 'MD'
        },
        assignee: {
          id: 'agent1',
          name: 'Likitha'
        },
        watchers: [],
        visibility: 'Public',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        messages: [
          {
            id: 'msg3',
            ticketId: '3',
            author: {
              id: 'user3',
              name: 'Mike Davis',
              initials: 'MD',
              type: 'customer'
            },
            content: 'Would love to see dark mode support in the application for better user experience.',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            isInternal: false
          }
        ],
        isPrivate: false
      },
      {
        id: '4',
        title: 'Sample Ticket: How to Solve a Ticket in Bold Desk?',
        description: 'This is a sample ticket to demonstrate the ticket management system functionality.',
        status: 'On Hold',
        priority: 'Normal',
        type: 'Question',
        category: 'General',
        tags: ['sample', 'demo'],
        requester: {
          id: 'user4',
          name: 'Demo User',
          email: 'demo@example.com',
          initials: 'DU'
        },
        assignee: {
          id: 'agent1',
          name: 'Likitha'
        },
        watchers: [],
        visibility: 'Public',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        messages: [
          {
            id: 'msg4',
            ticketId: '4',
            author: {
              id: 'user4',
              name: 'Demo User',
              initials: 'DU',
              type: 'customer'
            },
            content: 'This is a sample ticket to demonstrate the ticket management system functionality.',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            isInternal: false
          }
        ],
        isPrivate: false
      }
    ];

    this.ticketsSubject.next(sampleTickets);
    this.saveTicketsToStorage(sampleTickets);
    this.updateCounts(sampleTickets);
  }

  // Public methods
  getTickets(): Observable<Ticket[]> {
    return this.tickets$;
  }

  getCounts(): Observable<TicketCounts> {
    return this.counts$;
  }

  getTicketById(id: string): Observable<Ticket | undefined> {
    return this.tickets$.pipe(
      map(tickets => tickets.find(ticket => ticket.id === id))
    );
  }

  createTicket(ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'messages'>): Observable<Ticket> {
    const newTicket: Ticket = {
      ...ticketData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [
        {
          id: this.generateId(),
          ticketId: '',
          author: {
            id: ticketData.requester.id,
            name: ticketData.requester.name,
            initials: ticketData.requester.initials,
            type: 'customer'
          },
          content: ticketData.description,
          createdAt: new Date(),
          isInternal: false
        }
      ]
    };

    // Update message with ticket ID
    newTicket.messages[0].ticketId = newTicket.id;

    const currentTickets = this.ticketsSubject.value;
    const updatedTickets = [newTicket, ...currentTickets];
    
    this.ticketsSubject.next(updatedTickets);
    this.saveTicketsToStorage(updatedTickets);
    this.updateCounts(updatedTickets);

    return new BehaviorSubject(newTicket).asObservable();
  }

  updateTicket(ticketId: string, updates: Partial<Ticket>): Observable<Ticket | null> {
    const currentTickets = this.ticketsSubject.value;
    const ticketIndex = currentTickets.findIndex(t => t.id === ticketId);
    
    if (ticketIndex === -1) {
      return new BehaviorSubject(null).asObservable();
    }

    const updatedTicket = {
      ...currentTickets[ticketIndex],
      ...updates,
      updatedAt: new Date()
    };

    const updatedTickets = [...currentTickets];
    updatedTickets[ticketIndex] = updatedTicket;
    
    this.ticketsSubject.next(updatedTickets);
    this.saveTicketsToStorage(updatedTickets);
    this.updateCounts(updatedTickets);

    return new BehaviorSubject(updatedTicket).asObservable();
  }

  addMessageToTicket(ticketId: string, messageContent: string, authorId: string, authorName: string, authorInitials: string, isInternal: boolean = false): Observable<TicketMessage | null> {
    const currentTickets = this.ticketsSubject.value;
    const ticketIndex = currentTickets.findIndex(t => t.id === ticketId);
    
    if (ticketIndex === -1) {
      return new BehaviorSubject(null).asObservable();
    }

    const newMessage: TicketMessage = {
      id: this.generateId(),
      ticketId,
      author: {
        id: authorId,
        name: authorName,
        initials: authorInitials,
        type: 'agent' // Assuming replies are from agents
      },
      content: messageContent,
      createdAt: new Date(),
      isInternal
    };

    const updatedTicket = {
      ...currentTickets[ticketIndex],
      messages: [...currentTickets[ticketIndex].messages, newMessage],
      updatedAt: new Date(),
      status: currentTickets[ticketIndex].status === 'Pending' ? 'Open' as const : currentTickets[ticketIndex].status
    };

    const updatedTickets = [...currentTickets];
    updatedTickets[ticketIndex] = updatedTicket;
    
    this.ticketsSubject.next(updatedTickets);
    this.saveTicketsToStorage(updatedTickets);
    this.updateCounts(updatedTickets);

    return new BehaviorSubject(newMessage).asObservable();
  }

  deleteTicket(ticketId: string): Observable<boolean> {
    const currentTickets = this.ticketsSubject.value;
    const updatedTickets = currentTickets.filter(t => t.id !== ticketId);
    
    this.ticketsSubject.next(updatedTickets);
    this.saveTicketsToStorage(updatedTickets);
    this.updateCounts(updatedTickets);

    return new BehaviorSubject(true).asObservable();
  }

  searchTickets(query: string): Observable<Ticket[]> {
    return this.tickets$.pipe(
      map(tickets => {
        if (!query.trim()) return tickets;
        
        const searchTerm = query.toLowerCase();
        return tickets.filter(ticket =>
          ticket.title.toLowerCase().includes(searchTerm) ||
          ticket.description.toLowerCase().includes(searchTerm) ||
          ticket.requester.name.toLowerCase().includes(searchTerm) ||
          ticket.requester.email.toLowerCase().includes(searchTerm) ||
          ticket.id.toLowerCase().includes(searchTerm)
        );
      })
    );
  }

  sortTickets(tickets: Ticket[], sortBy: string): Ticket[] {
    switch (sortBy) {
      case 'Created - Desc':
        return [...tickets].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      case 'Modified - Desc':
        return [...tickets].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      case 'Priority - High to Low':
        const priorityOrder = { 'Urgent': 4, 'High': 3, 'Normal': 2, 'Low': 1 };
        return [...tickets].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
      case 'Status - A to Z':
        return [...tickets].sort((a, b) => a.status.localeCompare(b.status));
      default:
        return tickets;
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
