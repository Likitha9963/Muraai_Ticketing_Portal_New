export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'Pending' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  type: 'Bug' | 'Feature' | 'Question' | 'Task';
  category: string;
  assignee: User;
  requester: User;
  createdAt: Date;
  updatedAt: Date;
  resolutionDue?: Date;
  responseDue?: Date;
  tags: string[];
  visibility: 'Public' | 'Private';
  messages: TicketMessage[];
  activities: TicketActivity[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  initials: string;
  contactGroup?: string;
  phoneNumber?: string;
  mobileNumber?: string;
  timeZone?: string;
}

export interface TicketMessage {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  isPublic: boolean;
  attachments?: string[];
}

export interface TicketActivity {
  id: string;
  type: 'status_change' | 'assignment' | 'comment' | 'priority_change';
  description: string;
  author: User;
  createdAt: Date;
  oldValue?: string;
  newValue?: string;
}

export interface Report {
  id: string;
  name: string;
  owner: string;
  category: 'System' | 'Custom';
  viewerAccess: string;
  editorAccess: string;
  isFavorite: boolean;
}

export interface SortOption {
  label: string;
  value: string;
  direction: 'asc' | 'desc';
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}
