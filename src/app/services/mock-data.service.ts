import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Ticket, User, Report, TicketMessage, TicketActivity } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private ticketsSubject = new BehaviorSubject<Ticket[]>([]);
  private reportsSubject = new BehaviorSubject<Report[]>([]);
  private selectedTicketSubject = new BehaviorSubject<Ticket | null>(null);

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    const users: User[] = [
      {
        id: '1',
        name: 'Lucas Martinez',
        email: 'lucas.martinez@example.com',
        avatar: '',
        initials: 'LM',
        contactGroup: 'Northbridge Technology',
        phoneNumber: '+34 600 123 456',
        timeZone: 'Eastern Standard Time'
      },
      {
        id: '2',
        name: 'Emily Carter',
        email: 'emily.carter@example.com',
        avatar: '',
        initials: 'EC',
        contactGroup: 'Tech Solutions Inc',
        phoneNumber: '+1 555 123 4567'
      },
      {
        id: '3',
        name: 'Marco Rossi',
        email: 'marco.rossi@example.com',
        avatar: '',
        initials: 'MR',
        contactGroup: 'Digital Innovations',
        phoneNumber: '+39 123 456 789'
      },
      {
        id: '4',
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        avatar: '',
        initials: 'AJ',
        contactGroup: 'StartupCorp',
        phoneNumber: '+1 555 987 6543'
      },
      {
        id: '5',
        name: 'Likitha',
        email: 'likitha@example.com',
        avatar: '',
        initials: 'LI',
        contactGroup: 'Support Team'
      }
    ];

    const tickets: Ticket[] = [
      {
        id: '1',
        title: 'Sample Ticket: How to Solve a Ticket in Bold Desk?',
        description: 'Hello, Let\'s start by solving a sample ticket together to see how you and your agents can quickly and efficiently handle customer requests.',
        status: 'Open',
        priority: 'Normal',
        type: 'Question',
        category: 'General',
        assignee: users[4], // Likitha
        requester: users[0], // Lucas Martinez
        createdAt: new Date('2025-10-01T07:20:00'),
        updatedAt: new Date('2025-10-01T07:20:00'),
        tags: [],
        visibility: 'Public',
        messages: [
          {
            id: '1',
            content: 'Hello, Let\'s start by solving a sample ticket together to see how you and your agents can quickly and efficiently handle customer requests.',
            author: users[0],
            createdAt: new Date('2025-10-01T07:20:00'),
            isPublic: true
          }
        ],
        activities: [
          {
            id: '1',
            type: 'status_change',
            description: 'Status changed from New to Open',
            author: users[4],
            createdAt: new Date('2025-10-01T07:20:00'),
            oldValue: 'New',
            newValue: 'Open'
          }
        ]
      },
      {
        id: '2',
        title: 'Sample Ticket: Request to Update Shipping Address',
        description: 'I need to update my shipping address for my recent order. Can you please help me with this?',
        status: 'Pending',
        priority: 'Normal',
        type: 'Task',
        category: 'Orders',
        assignee: users[4],
        requester: users[1], // Emily Carter
        createdAt: new Date('2025-10-01T06:30:00'),
        updatedAt: new Date('2025-10-01T06:30:00'),
        tags: ['shipping', 'address'],
        visibility: 'Public',
        messages: [
          {
            id: '2',
            content: 'I need to update my shipping address for my recent order. Can you please help me with this?',
            author: users[1],
            createdAt: new Date('2025-10-01T06:30:00'),
            isPublic: true
          }
        ],
        activities: []
      },
      {
        id: '3',
        title: 'Sample Ticket: Laptop Battery Draining Rapidly',
        description: 'My laptop battery is draining very quickly, even when not in use. This started happening after the latest update.',
        status: 'Open',
        priority: 'High',
        type: 'Bug',
        category: 'Hardware',
        assignee: users[4],
        requester: users[2], // Marco Rossi
        createdAt: new Date('2025-10-01T05:45:00'),
        updatedAt: new Date('2025-10-01T05:45:00'),
        tags: ['battery', 'hardware'],
        visibility: 'Public',
        messages: [
          {
            id: '3',
            content: 'My laptop battery is draining very quickly, even when not in use. This started happening after the latest update.',
            author: users[2],
            createdAt: new Date('2025-10-01T05:45:00'),
            isPublic: true
          }
        ],
        activities: []
      },
      {
        id: '4',
        title: 'Sample Ticket: Authentication failure',
        description: 'Unable to log in to the system. Getting authentication error.',
        status: 'Open',
        priority: 'Urgent',
        type: 'Bug',
        category: 'Authentication',
        assignee: users[4],
        requester: users[3], // Alex Johnson
        createdAt: new Date('2025-10-01T04:15:00'),
        updatedAt: new Date('2025-10-01T04:15:00'),
        tags: ['authentication', 'login'],
        visibility: 'Public',
        messages: [
          {
            id: '4',
            content: 'Unable to log in to the system. Getting authentication error.',
            author: users[3],
            createdAt: new Date('2025-10-01T04:15:00'),
            isPublic: true
          }
        ],
        activities: []
      }
    ];

    const reports: Report[] = [
      {
        id: '1',
        name: 'Support Monitoring Dashboard',
        owner: 'System Default',
        category: 'System',
        viewerAccess: 'Any Agents',
        editorAccess: 'Private',
        isFavorite: false
      },
      {
        id: '2',
        name: 'Support Traffic Dashboard',
        owner: 'System Default',
        category: 'System',
        viewerAccess: 'Any Agents',
        editorAccess: 'Private',
        isFavorite: false
      },
      {
        id: '3',
        name: 'SLA Dashboard',
        owner: 'System Default',
        category: 'System',
        viewerAccess: 'Any Agents',
        editorAccess: 'Private',
        isFavorite: false
      },
      {
        id: '4',
        name: 'Agent or Group Performance Dashboard',
        owner: 'System Default',
        category: 'System',
        viewerAccess: 'Any Agents',
        editorAccess: 'Private',
        isFavorite: false
      },
      {
        id: '5',
        name: 'Contact Dashboard',
        owner: 'System Default',
        category: 'System',
        viewerAccess: 'Any Agents',
        editorAccess: 'Private',
        isFavorite: false
      },
      {
        id: '6',
        name: 'Customer Satisfaction Report',
        owner: 'System Default',
        category: 'System',
        viewerAccess: 'Any Agents',
        editorAccess: 'Private',
        isFavorite: false
      },
      {
        id: '7',
        name: 'Ticket Conversation Report',
        owner: 'System Default',
        category: 'System',
        viewerAccess: 'Any Agents',
        editorAccess: 'Private',
        isFavorite: false
      },
      {
        id: '8',
        name: 'Worklog Report',
        owner: 'System Default',
        category: 'System',
        viewerAccess: 'Any Agents',
        editorAccess: 'Private',
        isFavorite: false
      },
      {
        id: '9',
        name: 'Ticket Metrics Report',
        owner: 'System Default',
        category: 'System',
        viewerAccess: 'Any Agents',
        editorAccess: 'Private',
        isFavorite: false
      }
    ];

    this.ticketsSubject.next(tickets);
    this.reportsSubject.next(reports);
  }

  getTickets(): Observable<Ticket[]> {
    return this.ticketsSubject.asObservable();
  }

  getReports(): Observable<Report[]> {
    return this.reportsSubject.asObservable();
  }

  getSelectedTicket(): Observable<Ticket | null> {
    return this.selectedTicketSubject.asObservable();
  }

  selectTicket(ticket: Ticket | null) {
    this.selectedTicketSubject.next(ticket);
  }

  updateTicketStatus(ticketId: string, status: Ticket['status']) {
    const tickets = this.ticketsSubject.value;
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    if (ticketIndex !== -1) {
      tickets[ticketIndex].status = status;
      tickets[ticketIndex].updatedAt = new Date();
      this.ticketsSubject.next([...tickets]);
    }
  }

  addTicketMessage(ticketId: string, message: Omit<TicketMessage, 'id'>) {
    const tickets = this.ticketsSubject.value;
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    if (ticketIndex !== -1) {
      const newMessage: TicketMessage = {
        ...message,
        id: Date.now().toString()
      };
      tickets[ticketIndex].messages.push(newMessage);
      tickets[ticketIndex].updatedAt = new Date();
      this.ticketsSubject.next([...tickets]);
    }
  }

  getDashboardStats() {
    const tickets = this.ticketsSubject.value;
    return {
      pending: tickets.filter(t => t.status === 'Pending').length,
      onHold: tickets.filter(t => t.status === 'Open').length,
      resolutionDue: 0,
      responseDue: 0,
      totalTickets: tickets.length
    };
  }
}
