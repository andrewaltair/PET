/**
 * Performance Testing Script
 * Tests the Pet Service Marketplace API for performance bottlenecks
 */

const http = require('http');
const https = require('https');
const { performance } = require('perf_hooks');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';
const CONCURRENT_USERS = parseInt(process.env.CONCURRENT_USERS || '10');
const REQUESTS_PER_USER = parseInt(process.env.REQUESTS_PER_USER || '50');
const TEST_DURATION = parseInt(process.env.TEST_DURATION || '30000'); // 30 seconds

// Test scenarios
const scenarios = [
  {
    name: 'GET /api/v1/services',
    endpoint: '/api/v1/services',
    method: 'GET',
    weight: 40, // 40% of traffic
  },
  {
    name: 'GET /api/v1/services/:id',
    endpoint: '/api/v1/services/test-service-id',
    method: 'GET',
    weight: 20, // 20% of traffic
  },
  {
    name: 'GET /api/v1/services/top-rated-providers',
    endpoint: '/api/v1/services/top-rated-providers',
    method: 'GET',
    weight: 30, // 30% of traffic
  },
  {
    name: 'GET /health',
    endpoint: '/health',
    method: 'GET',
    weight: 10, // 10% of traffic
  },
];

// Store results
const results = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  responseTimes: [],
  errors: [],
  endpoints: {},
};

// Helper function to make HTTP request
function makeRequest(scenario) {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    const url = `${API_BASE_URL}${scenario.endpoint}`;
    
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        results.totalRequests++;
        results.responseTimes.push(responseTime);
        
        if (res.statusCode >= 200 && res.statusCode < 300) {
          results.successfulRequests++;
          
          if (!results.endpoints[scenario.name]) {
            results.endpoints[scenario.name] = {
              requests: 0,
              totalTime: 0,
              maxTime: 0,
              minTime: Infinity,
              errors: 0,
            };
          }
          
          const endpointStats = results.endpoints[scenario.name];
          endpointStats.requests++;
          endpointStats.totalTime += responseTime;
          endpointStats.maxTime = Math.max(endpointStats.maxTime, responseTime);
          endpointStats.minTime = Math.min(endpointStats.minTime, responseTime);
        } else {
          results.failedRequests++;
          results.errors.push({
            endpoint: scenario.name,
            statusCode: res.statusCode,
            responseTime,
          });
          
          if (!results.endpoints[scenario.name]) {
            results.endpoints[scenario.name] = {
              requests: 0,
              totalTime: 0,
              maxTime: 0,
              minTime: Infinity,
              errors: 0,
            };
          }
          results.endpoints[scenario.name].errors++;
        }
        
        resolve(responseTime);
      });
    });
    
    req.on('error', (error) => {
      results.failedRequests++;
      results.errors.push({
        endpoint: scenario.name,
        error: error.message,
      });
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      results.failedRequests++;
      results.errors.push({
        endpoint: scenario.name,
        error: 'Request timeout',
      });
      reject(new Error('Request timeout'));
    });
  });
}

// Simulate a user
async function simulateUser(userId) {
  const requests = [];
  
  for (let i = 0; i < REQUESTS_PER_USER; i++) {
    // Select scenario based on weight
    const random = Math.random() * 100;
    let cumulativeWeight = 0;
    let selectedScenario = scenarios[0];
    
    for (const scenario of scenarios) {
      cumulativeWeight += scenario.weight;
      if (random <= cumulativeWeight) {
        selectedScenario = scenario;
        break;
      }
    }
    
    requests.push(makeRequest(selectedScenario));
    
    // Add random delay between requests (50-200ms)
    const delay = Math.random() * 150 + 50;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  return Promise.allSettled(requests);
}

// Run load test
async function runLoadTest() {
  console.log('🚀 Starting Performance Test...\n');
  console.log(`Configuration:`);
  console.log(`- API URL: ${API_BASE_URL}`);
  console.log(`- Concurrent Users: ${CONCURRENT_USERS}`);
  console.log(`- Requests per User: ${REQUESTS_PER_USER}`);
  console.log(`- Test Duration: ${TEST_DURATION}ms\n`);
  
  const startTime = performance.now();
  
  // Create user simulations
  const userPromises = [];
  for (let i = 0; i < CONCURRENT_USERS; i++) {
    userPromises.push(simulateUser(i));
  }
  
  // Wait for all users to complete or timeout
  await Promise.race([
    Promise.all(userPromises),
    new Promise(resolve => setTimeout(resolve, TEST_DURATION)),
  ]);
  
  const endTime = performance.now();
  const totalTime = endTime - startTime;
  
  // Calculate statistics
  const avgResponseTime = results.responseTimes.reduce((a, b) => a + b, 0) / results.responseTimes.length;
  const sortedTimes = [...results.responseTimes].sort((a, b) => a - b);
  const p50 = sortedTimes[Math.floor(sortedTimes.length * 0.5)];
  const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
  const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)];
  
  const requestsPerSecond = (results.totalRequests / totalTime) * 1000;
  
  // Print results
  console.log('\n📊 Performance Test Results\n');
  console.log('Overall Statistics:');
  console.log(`- Total Requests: ${results.totalRequests}`);
  console.log(`- Successful: ${results.successfulRequests} (${((results.successfulRequests / results.totalRequests) * 100).toFixed(2)}%)`);
  console.log(`- Failed: ${results.failedRequests} (${((results.failedRequests / results.totalRequests) * 100).toFixed(2)}%)`);
  console.log(`- Requests/Second: ${requestsPerSecond.toFixed(2)}`);
  console.log(`- Total Test Time: ${(totalTime / 1000).toFixed(2)}s\n`);
  
  console.log('Response Time Statistics:');
  console.log(`- Average: ${avgResponseTime.toFixed(2)}ms`);
  console.log(`- Median (p50): ${p50.toFixed(2)}ms`);
  console.log(`- p95: ${p95.toFixed(2)}ms`);
  console.log(`- p99: ${p99.toFixed(2)}ms`);
  console.log(`- Min: ${Math.min(...results.responseTimes).toFixed(2)}ms`);
  console.log(`- Max: ${Math.max(...results.responseTimes).toFixed(2)}ms\n`);
  
  console.log('Endpoint Performance:');
  for (const [endpoint, stats] of Object.entries(results.endpoints)) {
    const avg = stats.totalTime / stats.requests;
    console.log(`\n${endpoint}:`);
    console.log(`  - Requests: ${stats.requests}`);
    console.log(`  - Avg Response Time: ${avg.toFixed(2)}ms`);
    console.log(`  - Min: ${stats.minTime.toFixed(2)}ms`);
    console.log(`  - Max: ${stats.maxTime.toFixed(2)}ms`);
    console.log(`  - Errors: ${stats.errors}`);
  }
  
  if (results.errors.length > 0) {
    console.log('\n❌ Errors:');
    const errorGroups = {};
    results.errors.forEach(error => {
      const key = error.error || error.statusCode;
      if (!errorGroups[key]) {
        errorGroups[key] = [];
      }
      errorGroups[key].push(error);
    });
    
    for (const [errorType, errors] of Object.entries(errorGroups)) {
      console.log(`\n${errorType}: ${errors.length} occurrences`);
    }
  }
  
  // Performance issues detected
  console.log('\n🔍 Performance Issues Detected:\n');
  
  const issues = [];
  
  if (avgResponseTime > 1000) {
    issues.push(`CRITICAL: Average response time (${avgResponseTime.toFixed(2)}ms) exceeds 1 second`);
  } else if (avgResponseTime > 500) {
    issues.push(`WARNING: Average response time (${avgResponseTime.toFixed(2)}ms) exceeds 500ms`);
  }
  
  if (p95 > 2000) {
    issues.push(`CRITICAL: 95th percentile response time (${p95.toFixed(2)}ms) exceeds 2 seconds`);
  } else if (p95 > 1000) {
    issues.push(`WARNING: 95th percentile response time (${p95.toFixed(2)}ms) exceeds 1 second`);
  }
  
  if (requestsPerSecond < 10) {
    issues.push(`CRITICAL: Throughput (${requestsPerSecond.toFixed(2)} req/s) is very low`);
  } else if (requestsPerSecond < 50) {
    issues.push(`WARNING: Throughput (${requestsPerSecond.toFixed(2)} req/s) is below optimal`);
  }
  
  const errorRate = (results.failedRequests / results.totalRequests) * 100;
  if (errorRate > 5) {
    issues.push(`CRITICAL: Error rate (${errorRate.toFixed(2)}%) exceeds 5%`);
  } else if (errorRate > 1) {
    issues.push(`WARNING: Error rate (${errorRate.toFixed(2)}%) exceeds 1%`);
  }
  
  if (issues.length === 0) {
    console.log('✅ No critical performance issues detected');
  } else {
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue}`);
    });
  }
  
  return results;
}

// Run the test
runLoadTest().catch(console.error);

