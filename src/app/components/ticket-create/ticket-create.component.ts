import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketService, Ticket } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.css']
})
export class TicketCreateComponent {
  @Output() ticketCreated = new EventEmitter<Ticket>();
  @Output() cancelled = new EventEmitter<void>();

  ticketForm: FormGroup;
  newContactForm: FormGroup;
  isSubmitting = false;
  showNewContactModal = false;

  brands = ['Individual', 'Enterprise', 'Premium'];
  priorities = ['Low', 'Normal', 'High', 'Urgent'];
  types = ['Bug', 'Feature Request', 'Question', 'Task', 'Incident'];
  categories = ['Technical', 'Account', 'Billing', 'Enhancement', 'General'];
  visibilityOptions = ['Public', 'Private', 'Internal'];
  departments = ['CloudOps', 'ITSM', 'Muraai']; // Added Departments

  requesters = [
    { name: 'John Doe', email: 'john.doe@example.com' },
    { name: 'Jane Smith', email: 'jane.smith@example.com' },
    { name: 'Mike Johnson', email: 'mike.johnson@example.com' },
    { name: 'Sarah Wilson', email: 'sarah.wilson@example.com' }
  ];

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private router: Router
  ) {
    this.ticketForm = this.fb.group({
      brand: ['Individual', Validators.required],
      isPrivate: [false],
      requester: ['', Validators.required],
      subject: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['Normal', Validators.required],
      type: [''],
      tags: [''],
      category: [''],
      watchers: [[]],
      assignmentType: ['auto'],
      assignee: [''],
      department: ['', Validators.required] // Added department control
    });

    this.newContactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // ------------------- Submit & Cancel -------------------
  onSubmit(): void {
    if (this.ticketForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const formValue = this.ticketForm.value;
      const tags = formValue.tags
        ? formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: any) => tag)
        : [];

      const selectedRequester = this.requesters.find(r => r.email === formValue.requester);
      const requesterName = selectedRequester ? selectedRequester.name : 'Unknown User';
      const requesterEmail = selectedRequester ? selectedRequester.email : formValue.requester;

      const initials = requesterName
        .split(' ')
        .map((n: string) => n.charAt(0).toUpperCase())
        .join('')
        .substring(0, 2);

      const ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'messages'> = {
        title: formValue.subject,
        description: formValue.description,
        status: 'Pending',
        priority: formValue.priority,
        type: formValue.type || 'General',
        category: formValue.category || 'General',
        tags: tags,
        requester: {
          id: this.generateUserId(),
          name: requesterName,
          email: requesterEmail,
          initials: initials
        },
        assignee: {
          id: 'agent1',
          name: formValue.assignmentType === 'auto' ? 'Auto Assign' : (formValue.assignee || 'Unassigned')
        },
        watchers: formValue.watchers || [],
        visibility: 'Public',
        isPrivate: formValue.isPrivate,
        resolutionDue: this.calculateResolutionDue(formValue.priority),
        department: formValue.department // Added department
      };

      this.ticketService.createTicket(ticketData).subscribe({
        next: (ticket) => {
          this.ticketCreated.emit(ticket);
          this.resetForm();
          this.isSubmitting = false;
          this.router.navigate(['/tickets']);
        },
        error: (error) => {
          console.error('Error creating ticket:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.resetForm();
    this.cancelled.emit();
    this.router.navigate(['/tickets']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.ticketForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private resetForm(): void {
    this.ticketForm.reset({
      brand: 'Individual',
      isPrivate: false,
      priority: 'Normal',
      assignmentType: 'auto',
      watchers: [],
      department: '' // Reset department
    });
  }

  private generateUserId(): string {
    return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private calculateResolutionDue(priority: string): Date {
    const now = new Date();
    let hoursToAdd = 72;

    switch (priority) {
      case 'Urgent':
        hoursToAdd = 4;
        break;
      case 'High':
        hoursToAdd = 24;
        break;
      case 'Normal':
        hoursToAdd = 72;
        break;
      case 'Low':
        hoursToAdd = 168;
        break;
    }

    return new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000);
  }

  // ------------------- New Functions -------------------

  addMe() {
    const myEmail = 'current.user@example.com'; // replace with actual user email
    const myName = 'Current User'; // replace with actual user name
    this.ticketForm.get('requester')?.setValue(myEmail);

    if (!this.requesters.some(r => r.email === myEmail)) {
      this.requesters.push({ name: myName, email: myEmail });
    }
  }

  addNewContact() {
    this.showNewContactModal = true;
    this.newContactForm.reset();
  }

  saveNewContact() {
    if (this.newContactForm.valid) {
      const newContact = this.newContactForm.value;
      this.requesters.push(newContact);
      this.ticketForm.get('requester')?.setValue(newContact.email);
      this.showNewContactModal = false;
    }
  }

  addCC() {
    const ccEmail = prompt('Enter CC Email:');
    if (ccEmail) {
      const ccList = this.ticketForm.get('watchers')?.value || [];
      ccList.push(ccEmail);
      this.ticketForm.get('watchers')?.setValue(ccList);
    }
  }
}
