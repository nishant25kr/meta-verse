# meta-verse
A metaverse project built with a test-first approach. Currently includes the test suite for backend API functionality.

## Overview

This project aims to create a full-featured metaverse platform. At this stage, we have:
- **Test Suite**: Comprehensive tests for backend API using Jest and Axios
- **Planned**: Backend server, frontend client, and real-time features

Technologies in use:
- Jest for test framework
- Axios for HTTP requests
- WebSocket support for real-time communication

## Project Structure

```
meta-verse/
├── README.md              # This file
├── tests/
│   ├── index.test.js     # Main test suite
│   └── package.json      # Test dependencies
```

## Features Tested

### Authentication
- User signup (with duplicate prevention)
- User login with credential validation
- Token generation and management

### Backend Endpoints

**HTTP REST API** (http://localhost:3000)
- `/api/v1/signup` - User registration
- `/api/v1/login` - User authentication

**WebSocket Server** (ws://localhost:3001)
- Real-time communication support

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Running backend server on `http://localhost:3000`
- Running WebSocket server on `ws://localhost:3001`

## Installation

```bash
cd tests
npm install
```

## Running Tests

```bash
cd tests
npm test
```

## Dependencies

### Development
- **jest** - Testing framework

### Production
- **axios** - HTTP client for API requests

## Test Coverage

The test suite includes:
- Signup validation (duplicate user prevention)
- Login success scenarios
- Login failure scenarios
- WebSocket connectivity tests

## Contributing

To add new tests, modify the test file at `tests/index.test.js` and run the test suite to ensure all tests pass.

## License

ISC

## Notes

- Ensure the backend server is running before executing tests
- WebSocket server must be accessible at the configured URL
- All tests are asynchronous and use async/await pattern