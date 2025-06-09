# TechMart E-commerce Chatbot

A comprehensive e-commerce sales chatbot built with React, TypeScript, and Node.js. This application provides an AI-powered shopping assistant that helps customers find products, compare prices, and make informed purchasing decisions.

## Features

### Frontend
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Beautiful gradient-based design with smooth animations
- **Authentication**: Secure login and registration system
- **Real-time Chat**: Interactive chatbot interface with typing indicators
- **Session Management**: Persistent chat sessions with timestamps
- **Product Integration**: Inline product cards with purchase options

### Backend
- **RESTful API**: Node.js/Express server with comprehensive endpoints
- **Product Database**: 100+ mock electronics products with detailed information
- **Authentication**: JWT-based user authentication
- **Chat Processing**: Intelligent message processing with product recommendations
- **Session Persistence**: Chat history storage and retrieval

### Technical Architecture

#### Frontend Stack
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for responsive styling
- **Lucide React** for consistent iconography
- **Context API** for state management
- **Vite** for fast development and building

#### Backend Stack
- **Node.js** with Express framework
- **JSON file storage** for data persistence
- **bcryptjs** for password hashing
- **jsonwebtoken** for authentication
- **CORS** enabled for cross-origin requests

#### API Endpoints

**Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

**Products**
- `GET /api/products` - Get products with filtering options
- `GET /api/products/:id` - Get specific product details
- `GET /api/categories` - Get product categories

**Chat**
- `POST /api/chat` - Send message and get bot response
- `GET /api/chat/sessions` - Get user's chat sessions
- `GET /api/chat/sessions/:id` - Get specific chat session

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Backend Server**
   ```bash
   npm run server
   ```
   Server will run on http://localhost:3001

3. **Start the Frontend Development Server**
   ```bash
   npm run dev
   ```
   Frontend will run on http://localhost:5173

### Usage

1. **Registration/Login**: Create an account or sign in with existing credentials
2. **Start Chatting**: Use the chat interface to ask about products
3. **Product Search**: Ask for specific products, categories, or price ranges
4. **Interactive Shopping**: View product cards and add items to cart (simulated)

### Sample Queries
- "Show me laptops under $1000"
- "What's the best smartphone for photography?"
- "Find wireless headphones"
- "Compare gaming laptops"

## Bot Capabilities

The chatbot can handle various types of queries:

### Product Search
- Natural language product searches
- Category-based filtering (laptops, smartphones, headphones)
- Price-based recommendations
- Feature-based suggestions

### Interactive Features
- Greeting and help responses
- Product recommendations with images and specs
- Shopping cart integration (UI ready)
- Session continuity across conversations

### Response Types
- Text-based responses with product information
- Product cards with detailed specifications
- Quick action buttons for common queries
- Error handling for unclear requests

## Code Quality Features

### Best Practices
- **TypeScript**: Full type safety throughout the application
- **Modular Architecture**: Clear separation of concerns
- **Error Handling**: Comprehensive error handling and user feedback
- **Responsive Design**: Mobile-first approach with breakpoints
- **Security**: JWT authentication and password hashing
- **Performance**: Optimized imports and lazy loading ready

### File Organization
```
src/
├── components/
│   ├── Auth/           # Authentication components
│   ├── Chat/           # Chat interface components
│   └── Layout.tsx      # Main layout wrapper
├── contexts/           # React contexts
├── services/          # API service layer
├── types/             # TypeScript type definitions
└── App.tsx           # Main application component

server/
├── data/             # JSON data files
├── index.js         # Express server
└── README.md       # Documentation
```

## Design System

### Color Palette
- **Primary**: Blue gradient (#3B82F6 to #8B5CF6)
- **Secondary**: Slate tones for text and borders
- **Accent**: Purple for interactive elements
- **Success/Warning/Error**: Standard semantic colors

### Typography
- **System fonts** for optimal performance
- **Responsive sizing** with proper hierarchy
- **150% line height** for body text
- **120% line height** for headings

### Spacing
- **8px base unit** for consistent spacing
- **Responsive breakpoints**: 320px, 768px, 1024px
- **Container max-width**: 1200px

## Future Enhancements

### Potential Improvements
- Real database integration (PostgreSQL/MongoDB)
- Advanced NLP for better query understanding
- Shopping cart persistence and checkout flow
- User preferences and recommendation engine
- Multi-language support
- Voice interface integration
- Analytics and user behavior tracking

### Scalability Considerations
- Database optimization for large product catalogs
- Caching layer for frequently accessed data
- CDN integration for product images
- Load balancing for high traffic
- Microservices architecture for complex features

## Challenges Addressed

### Technical Challenges
1. **Real-time Communication**: Implemented smooth typing indicators and message flow
2. **State Management**: Used React Context for global state without complexity
3. **Authentication**: Secure JWT implementation with proper session handling
4. **Responsive Design**: Mobile-first approach with consistent experience
5. **Performance**: Optimized rendering and API calls

### UX Challenges
1. **Natural Conversations**: Bot responses feel conversational and helpful
2. **Visual Hierarchy**: Clear distinction between user and bot messages
3. **Product Discovery**: Inline product cards with essential information
4. **Error Handling**: Graceful degradation with helpful error messages
5. **Quick Actions**: Suggested prompts for new users

## License

This project is created for demonstration purposes and is open for educational use.