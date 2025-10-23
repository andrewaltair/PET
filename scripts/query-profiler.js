/**
 * Database Query Profiler
 * Identifies slow queries and optimization opportunities
 */

const PrismaClient = require('@prisma/client').PrismaClient;

const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'error' },
  ],
});

// Track query performance
const queryStats = {
  totalQueries: 0,
  slowQueries: [],
  queriesByEndpoint: {},
  indexOpportunities: [],
};

// Monitor queries
prisma.$on('query', (e) => {
  queryStats.totalQueries++;
  
  // Log slow queries (>100ms)
  if (e.duration > 100) {
    queryStats.slowQueries.push({
      query: e.query,
      duration: e.duration,
      timestamp: new Date(),
    });
    
    console.log(`⚠️ Slow Query Detected (${e.duration}ms):`);
    console.log(e.query);
    console.log('─'.repeat(80));
  }
  
  // Identify missing index opportunities
  if (e.query.includes('WHERE') && e.duration > 50) {
    const whereMatch = e.query.match(/WHERE\s+([^\s]+)\s*=/);
    if (whereMatch) {
      const field = whereMatch[1];
      queryStats.indexOpportunities.push({
        field,
        query: e.query.substring(0, 200),
        duration: e.duration,
      });
    }
  }
});

// Run test queries
async function profileQueries() {
  console.log('🔍 Profiling Database Queries...\n');
  
  try {
    // Test 1: Get all services
    console.log('Test 1: Fetching all services...');
    const start1 = Date.now();
    await prisma.service.findMany({
      take: 100,
      include: {
        provider: true,
      },
    });
    const duration1 = Date.now() - start1;
    console.log(`  Duration: ${duration1}ms\n`);
    
    // Test 2: Get services with bookings
    console.log('Test 2: Fetching services with bookings...');
    const start2 = Date.now();
    await prisma.service.findMany({
      include: {
        bookings: true,
        reviews: true,
      },
    });
    const duration2 = Date.now() - start2;
    console.log(`  Duration: ${duration2}ms\n`);
    
    // Test 3: Complex join query
    console.log('Test 3: Complex join (top-rated providers)...');
    const start3 = Date.now();
    await prisma.user.findMany({
      where: {
        role: 'PROVIDER',
      },
      include: {
        profile: true,
        services: true,
        providerReviews: true,
      },
    });
    const duration3 = Date.now() - start3;
    console.log(`  Duration: ${duration3}ms\n`);
    
    // Test 4: Search query
    console.log('Test 4: Search with filters...');
    const start4 = Date.now();
    await prisma.service.findMany({
      where: {
        OR: [
          { title: { contains: 'walking', mode: 'insensitive' } },
          { description: { contains: 'walking', mode: 'insensitive' } },
        ],
      },
    });
    const duration4 = Date.now() - start4;
    console.log(`  Duration: ${duration4}ms\n`);
    
    // Test 5: Pagination query
    console.log('Test 5: Paginated query...');
    const start5 = Date.now();
    const [services, count] = await Promise.all([
      prisma.service.findMany({
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.service.count(),
    ]);
    const duration5 = Date.now() - start5;
    console.log(`  Duration: ${duration5}ms\n`);
    
    // Generate report
    console.log('\n📊 Query Performance Summary\n');
    console.log('='.repeat(80));
    console.log(`Total Queries Executed: ${queryStats.totalQueries}`);
    console.log(`Slow Queries (>100ms): ${queryStats.slowQueries.length}`);
    console.log(`Index Opportunities: ${queryStats.indexOpportunities.length}\n`);
    
    if (queryStats.slowQueries.length > 0) {
      console.log('⚠️ Slow Queries Detected:\n');
      queryStats.slowQueries.forEach((q, index) => {
        console.log(`${index + 1}. Query took ${q.duration}ms`);
        console.log(`   ${q.query.substring(0, 150)}...\n`);
      });
    }
    
    if (queryStats.indexOpportunities.length > 0) {
      console.log('💡 Index Opportunities:\n');
      const uniqueFields = [...new Set(queryStats.indexOpportunities.map(q => q.field))];
      uniqueFields.forEach((field, index) => {
        console.log(`${index + 1}. Consider adding index on: ${field}`);
      });
    }
    
  } catch (error) {
    console.error('Error profiling queries:', error);
  } finally {
    await prisma.$disconnect();
  }
}

profileQueries();

