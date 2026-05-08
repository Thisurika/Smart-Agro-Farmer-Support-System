const fs = require('fs');

const diagram1 = `graph TD
    %% Define Styles
    classDef client fill:#e1f5fe,stroke:#039be5,stroke-width:2px;
    classDef server fill:#f3e5f5,stroke:#8e24aa,stroke-width:2px;
    classDef db fill:#e8f5e9,stroke:#43a047,stroke-width:2px;
    classDef external fill:#fff3e0,stroke:#fb8c00,stroke-width:2px;
    classDef user fill:#eceff1,stroke:#607d8b,stroke-width:2px,shape:circle;

    %% Actors
    User((Farmer / User)):::user

    %% Client Side (Frontend)
    subgraph Frontend [Client - React + Vite + Redux]
        UI[User Interface]
        AuthUI[Authentication UI]
        DashboardUI[Dashboard / User Portal]
        ChatbotUI[AI Chatbot Widget]
        MapUI[Interactive Maps / Leaflet]
        DataVis[Data Visualization / Recharts]
        
        UI --> AuthUI
        UI --> DashboardUI
        DashboardUI --> ChatbotUI
        DashboardUI --> MapUI
        DashboardUI --> DataVis
    end

    %% Server Side (Backend API)
    subgraph Backend [Server - Node.js + Express]
        API_Gateway[API Gateway / Router]
        
        %% Middleware
        Security[Security: Helmet, CORS, Rate Limit]
        
        %% Controllers/Routes
        AuthAPI[Auth Service]
        UserAPI[User Profile Service]
        CropAPI[Crop Management]
        ChemicalAPI[Chemicals / Pesticides]
        WeatherAPI[Weather Service]
        PaymentAPI[Payment Processing]
        FeedbackAPI[Feedback & Ratings]
        NotificationAPI[Notification System]
        ChatbotAPI[Chatbot Service]

        API_Gateway --> Security
        Security --> AuthAPI
        Security --> UserAPI
        Security --> CropAPI
        Security --> ChemicalAPI
        Security --> WeatherAPI
        Security --> PaymentAPI
        Security --> FeedbackAPI
        Security --> NotificationAPI
        Security --> ChatbotAPI
    end

    %% Database Layer
    subgraph DatabaseLayer [Database - MongoDB]
        MongoDB[(MongoDB Database)]
    end

    %% External Services
    subgraph External [External APIs]
        WeatherExt[External Weather API]
        PaymentGateway[External Payment Gateway]
        AI_Model[AI / LLM Model]
    end

    %% Interactions Client to Server
    User -->|Interacts with| UI
    AuthUI -->|Login/Register| API_Gateway
    DashboardUI -->|CRUD Operations| API_Gateway
    ChatbotUI -->|Sends queries| ChatbotAPI
    MapUI -->|Requests spatial data| API_Gateway
    
    %% Interactions Server to Database
    AuthAPI <-->|Verify/Store Credentials| MongoDB
    UserAPI <-->|Manage User Data| MongoDB
    CropAPI <-->|Store/Retrieve Crop Info| MongoDB
    ChemicalAPI <-->|Manage Chemical Data| MongoDB
    FeedbackAPI <-->|Manage Reviews| MongoDB
    NotificationAPI <-->|Log Notifications| MongoDB
    PaymentAPI <-->|Store Transactions| MongoDB

    %% Interactions Server to External
    WeatherAPI <-->|Fetch Live Data| WeatherExt
    PaymentAPI <-->|Process Payments| PaymentGateway
    ChatbotAPI <-->|Get AI Responses| AI_Model
    
    %% Apply classes
    UI:::client
    AuthUI:::client
    DashboardUI:::client
    ChatbotUI:::client
    MapUI:::client
    DataVis:::client
    
    API_Gateway:::server
    Security:::server
    AuthAPI:::server
    UserAPI:::server
    CropAPI:::server
    ChemicalAPI:::server
    WeatherAPI:::server
    PaymentAPI:::server
    FeedbackAPI:::server
    NotificationAPI:::server
    ChatbotAPI:::server
    
    MongoDB:::db
    
    WeatherExt:::external
    PaymentGateway:::external
    AI_Model:::external`;

const diagram2 = `graph TD
    %% Define Styles
    classDef root fill:#eceff1,stroke:#607d8b,stroke-width:2px;
    classDef provider fill:#e3f2fd,stroke:#1565c0,stroke-width:2px;
    classDef routing fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    classDef layout fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef page fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px;
    classDef component fill:#e1f5fe,stroke:#0277bd,stroke-width:2px;

    %% Root
    Root[index.js / main.jsx]:::root
    
    %% Providers
    ProviderGroup[Providers]:::provider
    ReduxStore(Redux Store):::provider
    ThemeContext(Theme/Auth Context):::provider
    Router(BrowserRouter):::routing
    
    Root --> ProviderGroup
    ProviderGroup -.-> ReduxStore
    ProviderGroup -.-> ThemeContext
    ProviderGroup --> Router
    
    %% App Entry
    App(App.jsx):::component
    Router --> App
    
    %% Routing logic
    App --> RouteConfig{Routes}:::routing

    %% Layouts
    RouteConfig --> MainLayout[Main Layout]:::layout
    RouteConfig --> AdminLayout[Admin Layout]:::layout
    RouteConfig --> AuthLayout[Auth Layout]:::layout

    %% Main Layout Components & Pages
    subgraph Main_Application [Main Application Flow]
        MainLayout --> Navbar[Navbar]:::component
        MainLayout --> Footer[Footer]:::component
        MainLayout --> ChatbotWidget[Floating Chatbot]:::component
        
        %% Pages
        MainLayout --> PublicPages[Public Pages]:::page
        MainLayout --> UserPages[User Protected Pages]:::page
        
        PublicPages --> Home(Home Page):::page
        PublicPages --> About(About Page):::page
        
        UserPages --> UserDashboard(Dashboard):::page
        UserPages --> CropManager(Crop Management):::page
        UserPages --> ChemicalRec(Chemical Recommendations):::page
        UserPages --> WeatherInfo(Weather Forecast):::page
    end

    %% Admin Layout Components & Pages
    subgraph Admin_Application [Admin Dashboard Flow]
        AdminLayout --> AdminSidebar[Sidebar]:::component
        AdminLayout --> AdminHeader[Header]:::component
        
        AdminLayout --> AdminPages[Admin Protected Pages]:::page
        AdminPages --> AdminDash(Overview):::page
        AdminPages --> UserManagement(Manage Users):::page
        AdminPages --> FeedbackManagement(View Feedback):::page
    end

    %% Auth Flow
    subgraph Authentication [Authentication Flow]
        AuthLayout --> Login(Login):::page
        AuthLayout --> Register(Register):::page
        AuthLayout --> ForgotPassword(Forgot Password):::page
    end`;

const base64_1 = Buffer.from(diagram1).toString('base64');
const base64_2 = Buffer.from(diagram2).toString('base64');

console.log("URL 1:", \`https://mermaid.ink/img/\${base64_1}\`);
console.log("URL 2:", \`https://mermaid.ink/img/\${base64_2}\`);
