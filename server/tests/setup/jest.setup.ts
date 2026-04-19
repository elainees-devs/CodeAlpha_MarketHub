// =====================================================
// GLOBAL JEST SETUP
// =====================================================

// clear mocks after every test
afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

// increase timeout if needed
jest.setTimeout(10000);

// optional: global environment variables
process.env.NODE_ENV = "test";