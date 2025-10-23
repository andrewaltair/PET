/**
 * Complete Performance Test Suite
 * Runs comprehensive performance tests and generates detailed report
 */

const http = require('http');
const { performance } = require('perf_hooks');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';

const testResults = {
  timestamp: new Date().toISOString(),
  tests: [],
  summary: {
    totalTests: 0,
    passed: 0,
    failed: 0,
    warnings: 0,
  },
  issues: [],
};

// Test configuration
const performanceThresholds = {
  'averageResponseTime': 500, // ms
  'p95ResponseTime': 1000, // ms
  'p99ResponseTime': 2000, // ms
  'requestsPerSecond': 50,
  'errorRate': 1, // percentage
};

// Helper function to make request
function makeRequest(endpoint, options = {}) {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    const url = `${API_BASE_URL}${endpoint}`;
    
    const req = http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        resolve({
          statusCode: res.statusCode,
          responseTime,
          data: data.substring(0, 200), // First 200 chars
          success: res.statusCode >= 200 && res.statusCode < 300,
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Run single test
async function runTest(name, endpoint, expectedStatus = 200) {
  const startTime = performance.now();
  
  try {
    const result = await makeRequest(endpoint);
    const duration = performance.now() - startTime;
    
    const testResult = {
      name,
      endpoint,
      status: 'passed',
      duration,
      responseTime: result.responseTime,
      statusCode: result.statusCode,
      success: result.success && result.statusCode === expectedStatus,
    };
    
    // Check performance thresholds
    if (result.responseTime > performanceThresholds.averageResponseTime) {
      testResult.status = 'warning';
      testResult.warning = `Response time (${result.responseTime.toFixed(2)}ms) exceeds threshold (${performanceThresholds.averageResponseTime}ms)`;
      testResults.summary.warnings++;
    }
    
    if (!testResult.success) {
      testResult.status = 'failed';
      testResult.error = `Expected status ${expectedStatus}, got ${result.statusCode}`;
      testResults.summary.failed++;
    } else {
      testResults.summary.passed++;
    }
    
    testResults.tests.push(testResult);
    testResults.summary.totalTests++;
    
    return testResult;
  } catch (error) {
    const duration = performance.now() - startTime;
    const testResult = {
      name,
      endpoint,
      status: 'failed',
      duration,
      error: error.message,
    };
    
    testResults.tests.push(testResult);
    testResults.summary.failed++;
    testResults.summary.totalTests++;
    
    return testResult;
  }
}

// Load test scenario
async function runLoadTest(endpoint, duration = 5000, concurrent = 5) {
  console.log(`Running load test on ${endpoint} for ${duration}ms with ${concurrent} concurrent users...`);
  
  const startTime = performance.now();
  const responseTimes = [];
  let successCount = 0;
  let failCount = 0;
  
  const promises = [];
  
  while (performance.now() - startTime < duration) {
    for (let i = 0; i < concurrent; i++) {
      promises.push(
        makeRequest(endpoint)
          .then(result => {
            responseTimes.push(result.responseTime);
            if (result.success) successCount++;
            else failCount++;
          })
          .catch(() => failCount++)
      );
    }
    
    // Small delay to prevent too many concurrent requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  await Promise.allSettled(promises);
  
  const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  const sortedTimes = [...responseTimes].sort((a, b) => a - b);
  const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
  const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)];
  const requestsPerSecond = (responseTimes.length / duration) * 1000;
  const errorRate = (failCount / (successCount + failCount)) * 100;
  
  return {
    totalRequests: responseTimes.length,
    avgResponseTime,
    p95,
    p99,
    requestsPerSecond,
    errorRate,
    successCount,
    failCount,
  };
}

// Main test suite
async function runTestSuite() {
  console.log('🚀 Starting Complete Performance Test Suite...\n');
  console.log(`API URL: ${API_BASE_URL}\n`);
  
  // Individual endpoint tests
  console.log('📋 Running Individual Endpoint Tests...\n');
  
  await runTest('Health Check', '/health', 200);
  await runTest('Get Services', '/api/v1/services?page=1&limit=10', 200);
  await runTest('Get Top-Rated Providers', '/api/v1/services/top-rated-providers?limit=10', 200);
  
  // Load tests
  console.log('\n📊 Running Load Tests...\n');
  
  const loadTest1 = await runLoadTest('/api/v1/services?page=1&limit=10', 10000, 10);
  const loadTest2 = await runLoadTest('/api/v1/services/top-rated-providers?limit=10', 10000, 10);
  
  // Analyze results
  console.log('\n🔍 Analyzing Results...\n');
  
  // Check load test 1
  if (loadTest1.avgResponseTime > performanceThresholds.averageResponseTime) {
    testResults.bus.push({
      severity: 'HIGH',
      issue: `Get Services endpoint average response time (${loadTest1.avgResponseTime.toFixed(2)}ms) exceeds threshold`,
      impact: 'Slow user experience',
      recommendation: 'Optimize query, add caching, or add database indexes',
    });
  }
  
  if (loadTest1.p95 > performanceThresholds.p95ResponseTime) {
    testResults.issues.push({
      severity: 'CRITICAL',
      issue: `Get Services p95 response time (${loadTest1.p95.toFixed(2)}ms) exceeds threshold`,
      impact: '95% of users experience slow responses',
      recommendation: 'Critical: Implement caching or optimize database queries',
    });
  }
  
  if (loadTest1.requestsPerSecond < performanceThresholds.requestsPerSecond) {
    testResults.issues.push({
      severity: 'HIGH',
      issue: `Throughput (${loadTest1.requestsPerSecond.toFixed(2)} req/s) is below optimal`,
      impact: 'System cannot handle load efficiently',
      recommendation: 'Scale horizontally or optimize application',
    });
  }
  
  if (loadTest1.errorRate > performanceThresholds.errorRate) {
    testResults.issues.push({
      severity: 'CRITICAL',
      issue: `Error rate (${loadTest1.errorRate.toFixed(2)}%) exceeds acceptable threshold`,
      impact: 'High number of failed requests',
      recommendation: 'Check server logs and database connection pool',
    });
  }
  
  // Check load test 2
  if (loadTest2.avgResponseTime > performanceThresholds.averageResponseTime) {
    testResults.issues.push({
      severity: 'HIGH',
      issue: `Top-Rated Providers endpoint average response time (${loadTest2.avgResponseTime.toFixed(2)}ms) exceeds threshold`,
      impact: 'Slow homepage carousel loading',
      recommendation: 'Cache top-rated providers or optimize complex join query',
    });
  }
  
  // Generate report
  console.log('\n📊 PERFORMANCE TEST RESULTS\n');
  console.log('='.repeat(80));
  console.log(`Generated: ${testResults.timestamp}\n`);
  
  console.log('Test Summary:');
  console.log(`- Total Tests: ${testResults.summary.totalTests}`);
  console.log(`- Passed: ${testResults.summary.passed}`);
  console.log(`- Failed: ${testResults.summary.failed}`);
  console.log(`- Warnings: ${testResults.summary.warnings}\n`);
  
  console.log('Individual Endpoint Tests:');
  testResults.tests.forEach(test => {
    const icon = test.status === 'passed' ? '✅' : test.status === 'warning' ? '⚠️' : '❌';
    console.log(`${icon} ${test.name}: ${test.responseTime?.toFixed(2)}ms`);
    if (test.warning) console.log(`   ${test.warning}`);
    if (test.error) console.log(`   ${test.error}`);
  });
  
  console.log('\nLoad Test Results:');
  console.log('\nGet Services Endpoint:');
  console.log(`- Total Requests: ${loadTest1.totalRequests}`);
  console.log(`- Avg Response Time: ${loadTest1.avgResponseTime.toFixed(2)}ms`);
  console.log(`- P95: ${loadTest1.p95.toFixed(2)}ms`);
  console.log(`- P99: ${loadTest1.p99.toFixed(2)}ms`);
  console.log(`- Requests/Second: ${loadTest1.requestsPerSecond.toFixed(2)}`);
  console.log(`- Error Rate: ${loadTest1.errorRate.toFixed(2)}%`);
  
  console.log('\nTop-Rated Providers Endpoint:');
  console.log(`- Total Requests: ${loadTest2.totalRequests}`);
  console.log(`- Avg Response Time: ${loadTest2.avgResponseTime.toFixed(2)}ms`);
  console.log(`- P95: ${loadTest2.p95.toFixed(2)}ms`);
  console.log(`- P99: ${loadTest2.p99.toFixed(2)}ms`);
  console.log(`- Requests/Second: ${loadTest2.requestsPerSecond.toFixed(2)}`);
  console.log(`- Error Rate: ${loadTest2.errorRate.toFixed(2)}%`);
  
  if (testResults.issues.length > 0) {
    console.log('\n🔴 Performance Issues Detected:\n');
    testResults.issues.forEach((issue, index) => {
      const icon = issue.severity === 'CRITICAL' ? '🔴' : '🟠';
      console.log(`${icon} ${index + 1}. [${issue.severity}] ${issue.issue}`);
      console.log(`   Impact: ${issue.impact}`);
      console.log(`   Recommendation: ${issue.recommendation}\n`);
    });
  } else {
    console.log('\n✅ No critical performance issues detected!');
  }
  
  // Save results
  const fs = require('fs');
  const path = require('path');
  const reportPath = path.join(__dirname, '../performance-test-results.json');
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  console.log(`\n📄 Results saved to: ${reportPath}`);
}

runTestSuite().catch(console.error);

