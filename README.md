# DevOps Demo

A comprehensive React application showcasing modern DevOps practices including CI/CD pipelines, containerization, automated testing, monitoring, security scanning, and infrastructure as code.

## 🚀 Features

### Core Application
- Interactive demo interface with real-time health monitoring
- Activity logging and error handling
- Environment-aware configuration
- Modern responsive UI with DevOps metrics

### DevOps Practices Implemented

#### **CI/CD Pipeline**
- ✅ **Automated Builds**: GitHub Actions with multi-stage pipeline
- ✅ **Security Scanning**: Dependency audit, Snyk, and Trivy container scanning
- ✅ **Automated Testing**: Unit tests with coverage reporting
- ✅ **Code Quality**: ESLint with automated checks
- ✅ **Deployment**: Automatic deployment to GitHub Pages
- ✅ **Coverage Reports**: Integrated with Codecov

#### **Containerization**
- ✅ **Multi-stage Dockerfile**: Optimized production builds
- ✅ **Docker Compose**: Full stack with monitoring services
- ✅ **Development Containers**: Hot-reload development environment
- ✅ **Health Checks**: Container health monitoring
- ✅ **Infrastructure as Code**: Compose-based service orchestration

#### **Monitoring & Observability**
- ✅ **Health Checks**: Real-time application health monitoring
- ✅ **Metrics Collection**: Prometheus integration
- ✅ **Visualization**: Grafana dashboards
- ✅ **Activity Logging**: In-app activity tracking
- ✅ **Performance Metrics**: Memory, uptime, user interactions

#### **Security**
- ✅ **Dependency Scanning**: Automated vulnerability detection
- ✅ **Container Security**: Trivy security scanning
- ✅ **Security Headers**: Nginx with security hardening
- ✅ **SSL/TLS**: HTTPS configuration with self-signed certs
- ✅ **Environment Variables**: Secure configuration management

#### **Infrastructure Management**
- ✅ **Environment Management**: Development/production configurations
- ✅ **Reverse Proxy**: Nginx load balancing
- ✅ **Caching Layer**: Redis integration
- ✅ **SSL Generation**: Automated certificate creation
- ✅ **Service Discovery**: Docker networking

## 🛠️ Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Git

### Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd DevOps
npm install

# Development mode
npm run dev

# Production build
npm run build
npm start
```

### Docker Development

```bash
# Development with hot reload
npm run docker:dev

# Production stack with monitoring
npm run docker:prod

# Stop all services
npm run docker:down
```

### SSL Certificate Generation

```bash
# Generate self-signed certificates for HTTPS
npm run ssl:generate
```

## 📊 Monitoring Stack

When running `npm run docker:prod`, you get access to:

- **Main App**: http://localhost:3000
- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Redis**: localhost:6379

## 🔧 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

### Production
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run start` - Start production server

### Docker & Infrastructure
- `npm run docker:build` - Build Docker image
- `npm run docker:run` - Run container
- `npm run docker:dev` - Development stack
- `npm run docker:prod` - Production stack
- `npm run docker:down` - Stop services

### Security
- `npm run security:audit` - Run security audit
- `npm run security:scan` - High-priority security scan

## 🌐 Environment Configuration

Copy `.env.example` to `.env.development` or `.env.production`:

```bash
# Development
cp .env.example .env.development

# Production
cp .env.example .env.production
```

Key environment variables:
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Version string
- `VITE_LOG_LEVEL` - Logging level (debug/info/error)
- `VITE_ENABLE_METRICS` - Enable metrics collection
- `VITE_HEALTH_CHECK_INTERVAL` - Health check frequency

## 🔄 CI/CD Pipeline

The GitHub Actions pipeline includes:

1. **Security Scan Job**
   - Dependency vulnerability scanning
   - Snyk security analysis
   - Container security scanning with Trivy

2. **Build & Test Job**
   - Code linting with ESLint
   - Unit test execution with coverage
   - Production build verification
   - Coverage reporting to Codecov

3. **Deployment Job**
   - GitHub Pages deployment
   - Artifact management
   - Environment-specific configuration

## 📈 Monitoring & Metrics

### Health Checks
- Application health status
- Container health monitoring
- Service availability checks

### Metrics Collected
- Application uptime
- Memory usage
- User interaction counts
- Response times

### Visualization
- Grafana dashboards for metrics
- Prometheus data collection
- Real-time monitoring

## 🔒 Security Features

- **Dependency Scanning**: Automated vulnerability detection
- **Container Security**: Trivy integration
- **Security Headers**: Nginx security hardening
- **SSL/TLS**: HTTPS support
- **Environment Variables**: Secure configuration

## 🏗️ Infrastructure as Code

### Docker Compose Services
- **app**: Main React application
- **nginx**: Reverse proxy with SSL
- **redis**: Caching and session storage
- **prometheus**: Metrics collection
- **grafana**: Visualization dashboard

### Configuration Files
- `docker-compose.yml` - Production stack
- `docker-compose.dev.yml` - Development stack
- `nginx/nginx.conf` - HTTP configuration
- `nginx/nginx-ssl.conf` - HTTPS configuration
- `monitoring/prometheus.yml` - Metrics configuration

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 📋 DevOps Checklist

This demo implements the following DevOps practices:

- [x] **Continuous Integration**: Automated builds and testing
- [x] **Continuous Deployment**: Automated deployment to production
- [x] **Infrastructure as Code**: Docker Compose configuration
- [x] **Monitoring**: Health checks and metrics collection
- [x] **Logging**: Activity tracking and error handling
- [x] **Security**: Vulnerability scanning and SSL/TLS
- [x] **Containerization**: Docker multi-stage builds
- [x] **Environment Management**: Dev/prod configurations
- [x] **Quality Gates**: Linting and testing requirements
- [x] **Performance Monitoring**: Metrics and visualization

## 🚀 Deployment

### GitHub Pages
Automatic deployment to GitHub Pages is configured in the CI/CD pipeline. The site will be deployed automatically when pushing to the `main` branch.

### Manual Deployment
```bash
# Build and deploy manually
npm run build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and security scans
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details
