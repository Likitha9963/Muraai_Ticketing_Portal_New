# BoldDesk Ticketing Portal - Angular Clone

A complete responsive Angular 16+ application that replicates the BoldDesk ticketing portal design and functionality.

## 🚀 Features

### UI & Layout
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Left Sidebar Navigation**: Home, Reports, Tickets, Contacts, Knowledge Base, Settings
- **Top Navigation Bar**: Search functionality, create button, notifications, user profile
- **Ticket Management**: List view with detailed ticket cards and comprehensive details panel
- **Reports Dashboard**: Sortable table with filtering and export capabilities
- **Dashboard**: Statistics cards, customer satisfaction metrics, and activity feeds

### Pages & Routing
- **Dashboard Page**: Mock charts, statistics, and activity overview
- **Tickets Page**: Ticket list with details panel, status management, and messaging
- **Reports Page**: Comprehensive reports table with sorting and filtering
- **Settings Page**: Configuration and preferences (placeholder)

### Functionality
- **Ticket Management**: View, select, and update ticket status
- **Real-time Updates**: Mock data service with reactive updates
- **Sorting & Filtering**: Multi-column sorting and search functionality
- **Responsive Navigation**: Mobile-friendly sidebar and navigation
- **Status Management**: Update ticket status with real-time feedback

## 🛠 Technology Stack

- **Angular 20+**: Latest Angular with standalone components
- **Tailwind CSS**: Utility-first CSS framework for styling
- **TypeScript**: Type-safe development
- **RxJS**: Reactive programming for data management
- **Angular Router**: Client-side routing
- **Angular Reactive Forms**: Form handling and validation

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Muraai_Ticketing_Portal_New
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   ng serve
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200/`

## 🏗 Project Structure

```
src/
├── app/
│   ├── components/          # Reusable components
│   │   ├── sidebar/         # Left navigation sidebar
│   │   └── navbar/          # Top navigation bar
│   ├── pages/               # Page components
│   │   ├── dashboard/       # Dashboard with stats and overview
│   │   ├── tickets/         # Ticket management interface
│   │   ├── reports/         # Reports table and management
│   │   └── settings/        # Settings and configuration
│   ├── services/            # Data services
│   │   └── mock-data.service.ts  # Mock data provider
│   ├── models/              # TypeScript interfaces
│   │   └── ticket.model.ts  # Data models and types
│   └── app.routes.ts        # Application routing
├── styles.css               # Global styles with Tailwind
└── index.html              # Main HTML file
```

## 🎨 Design Features

### Color Scheme
- **Primary**: Purple (#7c3aed) - BoldDesk brand color
- **Secondary**: Gray scale for text and backgrounds
- **Accent**: Blue and green for status indicators

### Components
- **Sidebar**: Collapsible navigation with icons and labels
- **Navbar**: Search, notifications, user menu, and create button
- **Ticket Cards**: Avatar, title, status, priority, and timestamps
- **Details Panel**: Tabbed interface for messages, activities, and properties
- **Reports Table**: Sortable columns with action buttons

### Responsive Design
- **Desktop**: Full layout with sidebar, main content, and details panel
- **Tablet**: Collapsed sidebar with responsive table layouts
- **Mobile**: Hidden sidebars, stacked layouts, and touch-friendly interfaces

## 📊 Mock Data

The application includes comprehensive mock data:
- **4 Sample Tickets**: Various statuses, priorities, and types
- **9 System Reports**: Different categories and access levels
- **User Profiles**: Complete user information with avatars
- **Dashboard Stats**: Ticket counts and satisfaction metrics

## 🔧 Development

### Available Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run lint` - Run linting

### Key Features Implemented
- ✅ Responsive layout matching BoldDesk design
- ✅ Complete routing between all pages
- ✅ Ticket selection and status management
- ✅ Sorting and filtering functionality
- ✅ Mock data service with reactive updates
- ✅ Mobile-responsive design
- ✅ Component-based architecture

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder** to your preferred hosting service

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational and demonstration purposes.

---

**Note**: This is a frontend-only implementation with mock data. For production use, integrate with a real backend API and implement proper authentication and data persistence.