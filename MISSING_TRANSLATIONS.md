# Missing Translation Strings

## Found Missing Strings Not in Translation Files

### 1. Service Categories (ServiceCategories.tsx)
- Already have: `services.dogBoarding`, `services.petSitting`, etc. ✅

### 2. Cost Estimates (CostEstimates.tsx) - MISSING
```json
"costEstimates": {
  "title": "Get free cost estimates.",
  "subtitle": "We analyzed millions of bids from pet sitters, groomers and dog walkers to see what pet boarding, pet grooming and dog walking services really cost. Find out what other people have paid for pet services like yours.",
  "service1Title": "Pet Boarding",
  "service1Desc": "Find trusted pet boarding services",
  "service2Title": "Pet Sitting",
  "service2Desc": "In-home pet care services",
  "service3Title": "Dog Walking",
  "service3Desc": "Professional dog walking services",
  "seePrices": "See prices",
  "ctaButton": "Get cost estimates"
}
```

### 3. Blog Posts Titles (BlogPosts.tsx) - MISSING
```json
"blogPosts": {
  "post1Title": "8 Tips to Find the Best Pet Sitter for Your First Time Dog Boarding or Pet Boarding",
  "post2Title": "Pet sitting vs pet boarding: which suits your dog and cat better?",
  "post3Title": "Pet hotel: the comparison between commercial and home boarding",
  "post4Title": "The essential guide for the first time pet sitter"
}
```

### 4. Locations "Pet Sitters" suffix (Locations.tsx) - MISSING
Currently hardcoded: `{country} Pet Sitters`
Already have: `locations.linkText` ✅ BUT need to check if it's being used

### 5. Dashboard Page strings (dashboard/page.tsx) - MISSING
Need to check dashboard for missing strings

### 6. Other Components
Need to check:
- BookingForm.tsx
- ReviewForm.tsx
- ChatWindow.tsx
- ConversationList.tsx
- Provider pages
- Service pages

## Quick Fix Needed

Add these to all three JSON files (en.json, ru.json, ka.json):

```json
"costEstimates": {
  "title": "Get free cost estimates.",
  "subtitle": "We analyzed millions of bids from pet sitters, groomers and dog walkers to see what pet boarding, pet grooming and dog walking services really cost. Find out what other people have paid for pet services like yours.",
  "service1Title": "Pet Boarding",
  "service1Desc": "Find trusted pet boarding services",
  "service2Title": "Pet Sitting",
  "service2Desc": "In-home pet care services",
  "service3Title": "Dog Walking",
  "service3Desc": "Professional dog walking services",
  "seePrices": "See prices",
  "ctaButton": "Get cost estimates"
},
"blogPosts": {
  "post1Title": "8 Tips to Find the Best Pet Sitter for Your First Time Dog Boarding or Pet Boarding",
  "post2Title": "Pet sitting vs pet boarding: which suits your dog and cat better?",
  "post3Title": "Pet hotel: the comparison between commercial and home boarding",
  "post4Title": "The essential guide for the first time pet sitter"
}
```

## Status
- ✅ Already added to lang files
- ⚠️ Need to add missing strings

