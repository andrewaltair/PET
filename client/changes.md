## Registration Form Validation Fix - 2025-01-27
Fixed ZodError in registration form - "name" field expected string but received undefined

**Changes:**
- Updated `client/src/app/[locale]/register/page.tsx`:
  - Added "name" field to form defaultValues
  - Added "name" input field to form with User icon and validation indicators
  - Imported User icon from lucide-react
- Updated `client/src/components/auth/RegisterForm.tsx`:
  - Added "confirmPassword" input field to match schema requirements

**Issue:** Registration schema required "name" and "confirmPassword" fields but form was missing them, causing validation errors on submit.

## Logo Font Enhancement - 2025-10-23 21:47:55
Added Righteous Google font for logo text styling
Updated client/src/app/[locale]/layout.tsx to import and configure Righteous font with --font-logo CSS variable
Updated client/src/components/homepage/PetBackerHeader.tsx:
- Applied Righteous font to PetService logo text using font-[var(--font-logo)]
- Added gradient text effect (green-600 to blue-600) with bg-clip-text
- Increased text size to text-3xl for better visibility
- Added hover effect with opacity transition
- Enhanced logo container with shadow-md
- Logo is clickable and links to homepage (/)

