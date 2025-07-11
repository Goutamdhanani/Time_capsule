# TimeCapsule dApp Frontend

A Netflix-style Time Capsule dApp built with React, TypeScript, and Tailwind CSS. This application provides a cinematic user interface for creating, exploring, and managing blockchain-based time capsules.

## Features

### 🎬 Netflix-Inspired UI
- Dark theme with cinematic animations
- Smooth transitions and micro-interactions
- Responsive design across all devices
- Modern glassmorphism effects

### 📝 Time Capsule Management
- Create time capsules with custom messages
- Set unlock dates for future revelation
- Public/private visibility controls
- Real-time form validation

### 🔍 Blockchain Explorer
- Visual blockchain representation
- Expandable block details
- Transaction history viewing
- Network statistics dashboard

### ⛏️ Mining Interface
- Interactive mining controls
- Real-time network status
- Block confirmation animations
- Mining progress indicators

### 📱 Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interfaces
- Adaptive layouts

## Technical Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **API Integration**: Fetch API with custom hooks
- **State Management**: React Hooks

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Flask backend running on http://localhost:5000

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd timecapsule-frontend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

### Backend Integration

The frontend expects a Flask backend running on `http://localhost:5000` with the following endpoints:

- `GET /api/capsules` - Retrieve all time capsules
- `POST /api/capsules` - Create a new time capsule
- `GET /api/blockchain` - Get blockchain data
- `POST /api/mine` - Mine a new block

## Project Structure

```
src/
├── components/
│   ├── ui/               # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Toggle.tsx
│   │   └── LoadingSpinner.tsx
│   ├── Header.tsx        # Main navigation
│   ├── TimeCapsuleForm.tsx
│   ├── CapsuleGrid.tsx
│   ├── BlockchainExplorer.tsx
│   └── MiningInterface.tsx
├── hooks/
│   └── useApi.ts         # API integration hooks
├── types/
│   └── index.ts          # TypeScript type definitions
├── App.tsx               # Main application component
├── main.tsx              # Application entry point
└── index.css             # Global styles
```

## API Integration

The application uses custom hooks for API integration:

```typescript
// Fetch data with loading states
const { data, loading, error } = useApi<TimeCapsule[]>('/api/capsules');

// Make API requests
const result = await apiRequest<TimeCapsule>('/api/capsules', {
  method: 'POST',
  body: JSON.stringify(capsuleData)
});
```

## Performance Optimizations

- Lazy loading for large datasets
- Optimized re-renders with React.memo
- Efficient state management
- Debounced search functionality
- Image optimization and lazy loading

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.