import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';
import { Report } from '../../models/ticket.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reports: Report[] = [];
  searchQuery = '';
  selectedOwner = 'Owner';
  currentSort = 'name';
  sortDirection = 'asc';

  views = [
    { name: 'All', active: true },
    { name: 'Favorites', active: false },
    { name: 'System', active: false },
    { name: 'Custom', active: false },
    { name: 'Public', active: false },
    { name: 'Owned by me', active: false },
    { name: 'Shared with me', active: false }
  ];

  categories = [
    { name: 'Categories', active: false }
  ];

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.mockDataService.getReports().subscribe(reports => {
      this.reports = reports;
    });
  }

  onSearch() {
    console.log('Searching reports for:', this.searchQuery);
  }

  selectView(viewName: string) {
    this.views.forEach(view => view.active = view.name === viewName);
    console.log('Selected view:', viewName);
  }

  sortBy(column: string) {
    if (this.currentSort === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort = column;
      this.sortDirection = 'asc';
    }
    
    this.reports.sort((a, b) => {
      let aValue = a[column as keyof Report];
      let bValue = b[column as keyof Report];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (this.sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }

  toggleFavorite(report: Report) {
    report.isFavorite = !report.isFavorite;
    console.log('Toggled favorite for:', report.name);
  }

  getSortIcon(column: string): string {
    if (this.currentSort !== column) {
      return 'M7 10l5 5 5-5z'; // Default sort icon
    }
    return this.sortDirection === 'asc' 
      ? 'M7 14l5-5 5 5z' // Up arrow
      : 'M7 10l5 5 5-5z'; // Down arrow
  }

  scheduleReport(report: Report) {
    console.log('Schedule report:', report.name);
  }

  exportReport(report: Report) {
    console.log('Export report:', report.name);
  }

  createDashboard() {
    console.log('Create dashboard clicked');
  }

  createReport() {
    console.log('Create report clicked');
  }
}
