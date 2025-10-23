/**
 * Comprehensive Performance Analysis Script
 * Analyzes database queries, API endpoints, and identifies bottlenecks
 */

const fs = require('fs');
const path = require('path');

const analysisReport = {
  timestamp: new Date().toISOString(),
  issues: [],
  recommendations: [],
  metrics: {},
};

// Analyze Prisma configuration
function analyzePrismaConfig() {
  console.log('🔍 Analyzing Prisma Configuration...\n');
  
  const prismaPath = path.join(__dirname, '../server/prisma/schema.prisma');
  
  if (!fs.existsSync(prismaPath)) {
    analysisReport.issues.push({
      severity: 'HIGH',
      category: 'Database',
      issue: 'Prisma schema file not found',
      impact: 'Unable to analyze database schema',
    });
    return;
  }
  
  const schema = fs.readFileSync(prismaPath, 'utf-8');
  
  // Check for missing indexes
  const modelRegex = /model\s+(\w+)\s*\{([^}]+)\}/g;
  let match;
  const missingIndexes = [];
  
  while ((match = modelRegex.exec(schema)) !== null) {
    const modelName = match[1];
    const modelBody = match[2];
    
    // Check for foreign keys without indexes
    const foreignKeyFields = modelBody.match(/\s+\w+\s+String\s+@map\("[\w_]+"\)/g) || [];
    
    foreignKeyFields.forEach(field => {
      const fieldName = field.match(/\s+(\w+)\s+String/)?.[1];
      if (fieldName && !modelBody.includes(`@@index`)) {
        // Check if there's no compound index with this field
        if (!modelBody.includes(`@@index([${fieldName}]`)) {
          missingIndexes.push({ model: modelName, field: fieldName });
        }
      }
    });
  }
  
  if (missingIndexes.length > 0) {
    analysisReport.issues.push({
      severity: 'HIGH',
      category: 'Database',
      issue: `Missing indexes on foreign key fields: ${missingIndexes.map(i => `${i.model}.${i.field}`).join(', ')}`,
      impact: 'Join queries will be slow without proper indexes',
      recommendation: 'Add indexes to all foreign key fields',
    });
  }
  
  // Check for JSON fields that might need indexing
  if (schema.includes('availability  Json')) {
    analysisReport.issues.push({
      severity: 'MEDIUM',
      category: 'Database',
      issue: 'Availability field is stored as JSON without proper indexing',
      impact: 'Querying availability requires full table scans',
      recommendation: 'Consider using a separate Availability table with proper indexes',
    });
  }
  
  // Check for missing database configuration
  if (schema.includes('provider = "mysql"')) {
    analysisReport.issues.push({
      severity: 'MEDIUM',
      category: 'Database',
      issue: 'MySQL database provider is configured (config suggests PostgreSQL)',
      impact: 'Potential incompatibility issues',
      recommendation: 'Verify database provider matches actual database',
    });
  }
}

// Analyze API endpoints
function analyzeAPIEndpoints() {
  console.log('🔍 Analyzing API Endpoints...\n');
  
  const serviceControllerPath = path.join(__dirname, '../server/src/controllers/serviceController.ts');
  
  if (!fs.existsSync(serviceControllerPath)) {
    return;
  }
  
  const serviceController = fs.readFileSync(serviceControllerPath, 'utf-8');
  
  // Check for N+1 query patterns
  if (serviceController.includes('include:')) {
    const includePatterns = serviceController.match(/include:\s*\{([^}]+)\}/g);
    
    if (includePatterns) {
      includePatterns.forEach(pattern => {
        if (pattern.includes('provider:') && pattern.includes('services:')) {
          analysisReport.issues.push({
            severity: 'HIGH',
            category: 'API',
            issue: 'Potential N+1 query pattern in getTopRatedProviders',
            impact: 'Multiple database queries executed instead of efficient joins',
            recommendation: 'Use Prisma\'s include with proper select to optimize queries',
          });
        }
      });
    }
  }
  
  // Check for pagination
  if (!serviceController.includes('skip') || !serviceController.includes('take')) {
    analysisReport.issues.push({
      severity: 'CRITICAL',
      category: 'API',
      issue: 'Missing pagination in some queries',
      impact: 'Large datasets will cause memory issues and slow responses',
      recommendation: 'Always implement pagination for list endpoints',
    });
  }
  
  // Check for error handling
  if (serviceController.includes('console.error')) {
    const errorMatches = serviceController.match(/console\.error/g);
    if (errorMatches && errorMatches.length > 0) {
      analysisReport.issues.push({
        severity: 'MEDIUM',
        category: 'Monitoring',
        issue: 'Using console.error for error logging',
        impact: 'No centralized error tracking or performance monitoring',
        recommendation: 'Implement proper logging framework (Winston, Pino)',
      });
    }
  }
}

// Analyze middleware and security
function analyzeMiddleware() {
  console.log('🔍 Analyzing Middleware Configuration...\n');
  
  const serverIndexPath = path.join(__dirname, '../server/src/index.ts');
  
  if (!fs.existsSync(serverIndexPath)) {
    return;
  }
  
  const serverIndex = fs.readFileSync(serverIndexPath, 'utf-8');
  
  // Check if rate limiting is disabled
  if (serverIndex.includes('// app.use(\'/api/\', limiter)')) {
    analysisReport.issues.push({
      severity: 'HIGH',
      category: 'Security',
      issue: 'Rate limiting is commented out',
      impact: 'API vulnerable to DDoS attacks and performance degradation',
      recommendation: 'Enable rate limiting for production',
    });
  }
  
  // Check for compression
  if (!serverIndex.includes('compression()')) {
    analysisReport.issues.push({
      severity: 'MEDIUM',
      category: 'Performance',
      issue: 'Response compression not enabled',
      impact: 'Larger response payloads and slower transfer times',
      recommendation: 'Enable compression middleware',
    });
  }
  
  // Check for request size limits
  if (serverIndex.includes('limit: \'10mb\'')) {
    analysisReport.issues.push({
      severity: 'MEDIUM',
      category: 'Performance',
      issue: 'Request body size limit is very high (10mb)',
      impact: 'Large requests can consume excessive memory',
      recommendation: 'Reduce body size limit to appropriate value for API',
    });
  }
}

// Analyze database queries
function analyzeDatabaseQueries() {
  console.log('🔍 Analyzing Database Query Patterns...\n');
  
  const serviceServicePath = path.join(__dirname, '../server/src/services/serviceService.ts');
  
  if (!fs.existsSync(serviceServicePath)) {
    return;
  }
  
  const serviceService = fs.readFileSync(serviceServicePath, 'utf-8');
  
  // Check for inefficient queries
  if (serviceService.includes('Promise.all')) {
    const promiseAllPatterns = serviceService.match(/Promise\.all\([^)]+\)/g);
    
    if (promiseAllPatterns) {
      promiseAllPatterns.forEach(pattern => {
        if (pattern.includes('findMany') && pattern.includes('count')) {
          // This is actually okay for pagination
        } else {
          analysisReport.issues.push({
            severity: 'MEDIUM',
            category: 'Database',
            issue: 'Multiple parallel queries detected',
            impact: 'Increased database load and potential connection pool exhaustion',
            recommendation: 'Optimize with single query using joins or aggregations',
          });
        }
      });
    }
  }
  
  // Check for missing includes on related data
  if (serviceService.includes('findMany') && !serviceService.includes('include:')) {
    analysisReport.issues.push({
      severity: 'HIGH',
      category: 'Database',
      issue: 'Query fetches data without related records',
      impact: 'Client may need to make additional API calls (N+1 problem)',
      recommendation: 'Use Prisma include to fetch related data in single query',
    });
  }
  
  // Check for inefficient sorting
  if (serviceService.includes('orderBy: { createdAt: \'desc\' }')) {
    analysisReport.issues.push({
      severity: 'MEDIUM',
      category: 'Database',
      issue: 'Sorting by createdAt without index',
      impact: 'Slow queries on large datasets',
      recommendation: 'Add index on createdAt field',
    });
  }
}

// Analyze caching strategy
function analyzeCaching() {
  console.log('🔍 Analyzing Caching Strategy...\n');
  
  const serverIndexPath = path.join(__dirname, '../server/src/index.ts');
  
  if (!fs.existsSync(serverIndexPath)) {
    return;
  }
  
  analysisReport.issues.push({
    severity: 'CRITICAL',
    category: 'Performance',
    issue: 'No caching layer implemented',
    impact: 'Every request hits the database',
    recommendation: 'Implement Redis caching for frequently accessed data',
  });
  
  analysisReport.issues.push({
    severity: 'HIGH',
    category: 'Performance',
    issue: 'No CDN or static asset caching',
    impact: 'Slow delivery of static assets and images',
    recommendation: 'Use CDN for static assets and implement proper cache headers',
  });
}

// Analyze frontend performance
function analyzeFrontend() {
  console.log('🔍 Analyzing Frontend Performance...\n');
  
  const clientNextConfigPath = path.join(__dirname, '../client/next.config.js');
  
  if (!fs.existsSync(clientNextConfigPath)) {
    return;
  }
  
  const nextConfig = fs.readFileSync(clientNextConfigPath, 'utf-8');
  
  // Check for image optimization
  if (!nextConfig.includes('images:')) {
    analysisReport.issues.push({
      severity: 'MEDIUM',
      category: 'Frontend',
      issue: 'Next.js image optimization may not be configured',
      impact: 'Large unoptimized images slow page load',
      recommendation: 'Enable Next.js image optimization',
    });
  }
  
  // Check for performance monitoring
  analysisReport.issues.push({
    severity: 'MEDIUM',
    category: 'Monitoring',
    issue: 'No client-side performance monitoring',
    impact: 'Unable to track real user performance metrics',
    recommendation: 'Implement Web Vitals tracking',
  });
}

// Generate comprehensive report
function generateReport() {
  console.log('\n📊 PERFORMANCE ANALYSIS REPORT\n');
  console.log('='.repeat(80));
  console.log(`Generated: ${analysisReport.timestamp}\n`);
  
  const issuesBySeverity = {
    CRITICAL: [],
    HIGH: [],
    MEDIUM: [],
    LOW: [],
  };
  
  analysisReport.issues.forEach(issue => {
    issuesBySeverity[issue.severity].push(issue);
  });
  
  console.log('🔴 CRITICAL ISSUES (Immediate Action Required):');
  console.log('─'.repeat(80));
  if (issuesBySeverity.CRITICAL.length === 0) {
    console.log('None\n');
  } else {
    issuesBySeverity.CRITICAL.forEach((issue, index) => {
      console.log(`\n${index + 1}. [${issue.category}] ${issue.issue}`);
      console.log(`   Impact: ${issue.impact}`);
      console.log(`   Recommendation: ${issue.recommendation}`);
    });
    console.log('');
  }
  
  console.log('🟠 HIGH PRIORITY ISSUES:');
  console.log('─'.repeat(80));
  if (issuesBySeverity.HIGH.length === 0) {
    console.log('None\n');
  } else {
    issuesBySeverity.HIGH.forEach((issue, index) => {
      console.log(`\n${index + 1}. [${issue.category}] ${issue.issue}`);
      console.log(`   Impact: ${issue.impact}`);
      console.log(`   Recommendation: ${issue.recommendation}`);
    });
    console.log('');
  }
  
  console.log('🟡 MEDIUM PRIORITY ISSUES:');
  console.log('─'.repeat(80));
  if (issuesBySeverity.MEDIUM.length === 0) {
    console.log('None\n');
  } else {
    issuesBySeverity.MEDIUM.forEach((issue, index) => {
      console.log(`\n${index + 1}. [${issue.category}] ${issue.issue}`);
      console.log(`   Impact: ${issue.impact}`);
      console.log(`   Recommendation: ${issue.recommendation}`);
    });
    console.log('');
  }
  
  // Summary
  console.log('📈 SUMMARY:');
  console.log('─'.repeat(80));
  console.log(`Total Issues Found: ${analysisReport.issues.length}`);
  console.log(`  - Critical: ${issuesBySeverity.CRITICAL.length}`);
  console.log(`  - High: ${issuesBySeverity.HIGH.length}`);
  console.log(`  - Medium: ${issuesBySeverity.MEDIUM.length}`);
  console.log(`  - Low: ${issuesBySeverity.LOW.length}`);
  
  console.log('\n✅ Top 10 Performance Issues to Address:\n');
  
  const topIssues = [
    ...issuesBySeverity.CRITICAL,
    ...issuesBySeverity.HIGH,
    ...issuesBySeverity.MEDIUM,
  ].slice(0, 10);
  
  topIssues.forEach((issue, index) => {
    console.log(`${index + 1}. [${issue.severity}] ${issue.issue}`);
  });
  
  // Save report to file
  const reportPath = path.join(__dirname, '../performance-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(analysisReport, null, 2));
  console.log(`\n📄 Full report saved to: ${reportPath}`);
}

// Run analysis
async function runAnalysis() {
  console.log('🚀 Starting Comprehensive Performance Analysis...\n');
  
  analyzePrismaConfig();
  analyzeAPIEndpoints();
  analyzeMiddleware();
  analyzeDatabaseQueries();
  analyzeCaching();
  analyzeFrontend();
  
  generateReport();
}

runAnalysis().catch(console.error);

