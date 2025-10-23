# Performance Fixes Implementation Plan

## Execution Order & Strategy

### Phase 1: Critical Infrastructure Fixes (Immediate Impact)
1. ✅ Add database indexes
2. ✅ Enable rate limiting
3. ✅ Reduce request body limit
4. ✅ Add createdAt indexes

### Phase 2: Core Performance Optimizations
5. ✅ Implement Redis caching layer
6. ✅ Optimize N+1 queries
7. ✅ Fix pagination defaults
8. ✅ Normalize availability field (partial - schema update)

### Phase 3: Monitoring & Frontend
9. ✅ Add proper logging (replace console.error)
10. ✅ Add Next.js image optimization

---

## Step-by-Step Implementation

### STEP 1: Database Indexes (CRITICAL)
**Files to modify:**
- `server/prisma/schema.prisma`

**Changes:**
- Add indexes to all foreign keys
- Add indexes to frequently queried fields (createdAt, serviceType, status)
- Add compound indexes for common query patterns

**Expected impact:** 50-70% faster queries

---

### STEP 2: Enable Rate Limiting (CRITICAL)
**Files to modify:**
- `server/src/index.ts`

**Changes:**
- Uncomment rate limiting middleware
- Configure appropriate limits per endpoint type
- Add stricter limits for auth endpoints

**Expected impact:** Prevents abuse, stable performance

---

### STEP 3: Reduce Request Body Limit (HIGH)
**Files to modify:**
- `server/src/index.ts`

**Changes:**
- Reduce JSON limit from 10mb to 2mb
- Set different limits for specific routes if needed

**Expected impact:** Lower memory usage

---

### STEP 4: Add Redis Caching (CRITICAL)
**Files to modify:**
- `server/src/config/redis.ts` (new)
- `server/src/services/serviceService.ts`
- `server/package.json`

**Changes:**
- Install ioredis
- Create Redis configuration
- Add caching to getTopRatedProviders
- Add caching to getPublicServices

**Expected impact:** 60-80% reduction in database load

---

### STEP 5: Optimize N+1 Queries (HIGH)
**Files to modify:**
- `server/src/services/serviceService.ts`

**Changes:**
- Use database aggregation for getTopRatedProviders
- Optimize queries with proper select statements
- Cache results appropriately

**Expected impact:** 3-5x faster homepage

---

### STEP 6: Improve Pagination (MEDIUM)
**Files to modify:**
- `server/src/controllers/serviceController.ts`

**Changes:**
- Set better default limits
- Add cache key generation
- Validate parameters strictly

**Expected impact:** More stable performance

---

### STEP 7: Fix Availability Storage (MEDIUM)
**Files to modify:**
- `server/prisma/schema.prisma`

**Changes:**
- Add Availability model (for future normalization)
- Keep current JSON field but add it to documentation

**Expected impact:** Foundation for future optimization

---

### STEP 8: Add Logging (MEDIUM)
**Files to modify:**
- `server/src/config/logger.ts` (new)
- All service files (replace console.error)

**Changes:**
- Install pino logger
- Replace console.error with structured logging
- Add request logging middleware

**Expected impact:** Better observability

---

### STEP 9: Next.js Optimization (MEDIUM)
**Files to modify:**
- `client/next.config.js`

**Changes:**
- Configure image optimization
- Add compression
- Enable production optimizations

**Expected impact:** Faster page loads

---

### STEP 10: Add Performance Monitoring Hook (BONUS)
**Files to modify:**
- `server/src/middleware/performance.ts` (new)
- `server/src/index.ts`

**Changes:**
- Add performance monitoring middleware
- Track slow requests
- Log metrics

**Expected impact:** Proactive optimization

---

## Execution Notes

- Each step will be implemented and tested
- Changes will be backward compatible where possible
- Database migrations will be generated for schema changes
- Tests will be run after each major change

