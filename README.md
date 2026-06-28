# FinSmart - Financial Literacy Platform

**FinSmart** is an interactive financial literacy platform for students (ages 12-18+). It teaches money management through age-appropriate content, interactive tools, and gamified challenges.

**Live Site:** [appfinsmart.netlify.app](https://appfinsmart.netlify.app)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | HTML, CSS, JavaScript (vanilla) |
| **Styling** | Custom CSS design system + TailwindCSS (CDN) |
| **Backend** | Firebase (Authentication + Firestore) |
| **Hosting** | Netlify (static files) |

> No build system or bundler—all files served raw.

---

## Directory Structure

```
appfinsmart.netlify.app/
├── index.html              # Landing page (public)
├── learn.html              # Learning overview (public)
├── tools.html              # Tools overview (public)
├── challenges.html         # Challenges overview (public)
├── lesson.html             # Lesson viewer
├── 404.html                # Error page
│
├── application/            # Authenticated app pages
│   ├── login.html          # Sign up / Sign in
│   ├── index.html          # User dashboard
│   ├── tools.html          # Financial calculators
│   ├── challenges.html     # Interactive games
│   ├── learn.html          # Adult learning path
│   ├── learn_juniors.html  # Ages 12-15
│   ├── learn_seniors.html  # Ages 16-17
│   ├── chapter.html        # Adult chapter content
│   ├── chapter_juniors.html
│   └── chapter_seniors.html
│
├── js/
│   ├── firebase-init.js    # Firebase config (single source)
│   ├── auth.js             # Legacy auth module
│   ├── main.js             # Main app coordinator
│   └── components.js       # UI components (nav, animations)
│
└── css/
    ├── style.css           # Design system
    └── animations.css      # Keyframe animations
```

---

## Core Features

### 1. Age-Based Learning Paths

Users are routed to content based on their age (calculated from DOB at signup):

| Age Group | Learning Path | Content Focus |
|-----------|---------------|---------------|
| 12-15 | `learn_juniors.html` | Pocket money, basic saving, borrowing basics |
| 16-17 | `learn_seniors.html` | Bank accounts, UPI, earning, credit habits |
| 18+ | `learn.html` | Budgeting, investing, taxes, insurance |

Each path has 6 chapters with:
- Video content (embedded YouTube)
- Accordion-style reading sections
- Interactive quizzes
- Key takeaways
- Downloadable resources

---

### 2. Financial Calculators

Located in `application/tools.html`:

| Calculator | Purpose |
|------------|---------|
| **EMI Calculator** | Loan payment estimation |
| **Savings Goal** | Time to reach savings target |
| **ROI Calculator** | Return on investment |
| **Budget Planner** | 50/30/20 rule allocation |
| **Income Tax** | Tax estimation (new/old regime) |
| **Compound Interest** | Growth projection |

---

### 3. Interactive Challenges

Located in `application/challenges.html`:

| Challenge | Skill Taught |
|-----------|--------------|
| **Budget Boss** | Allocating ₹1,00,000 monthly with surprise expenses |
| **Smart Shopper** | Staying within ₹15,000 limit while shopping |
| **Investment Quest** | Simulating stock/bond/savings returns |
| **Debt Dilemma** | Repayment strategy impact on interest |
| **Scam Spotter** | Identifying phishing vs legitimate messages |

---

## Technical Overview (Developer Guide)

### Architecture Pattern

The application follows a **multi-page application (MPA)** pattern with:
- **Public pages** (root level) - Marketing/info pages
- **Authenticated pages** (`/application/`) - Protected user features
- **Shared modules** (`/js/`) - Reusable JavaScript

### Firebase SDK Usage

The project uses **Firebase Modular SDK v11.6.1** loaded via ES modules:

```javascript
// js/firebase-init.js - Centralized initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

**Why ES Modules?** The `<script type="module">` approach:
- Enables `import`/`export` syntax
- Deferred execution (runs after DOM ready)
- Strict mode by default
- Scoped variables (no global pollution)

### Authentication Implementation

**Login Flow (`application/login.html`):**

```javascript
// Sign up
const userCredential = await createUserWithEmailAndPassword(auth, email, password);
const user = userCredential.user;

// Save to Firestore
await setDoc(doc(db, 'users', user.uid), {
    name: formData.name,
    email: formData.email,
    dob: formData.dob,
    createdAt: serverTimestamp()
});

// Store session
sessionStorage.setItem('isLoggedIn', 'true');
sessionStorage.setItem('userUid', user.uid);
sessionStorage.setItem('userAge', calculateAge(dob));
```

**Page Protection Pattern:**

```javascript
// Runs immediately in <head> before DOM renders
if (sessionStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';  // Redirect unauthenticated users
}
```

### State Management

Session state stored in `sessionStorage` (cleared on tab close):

| Key | Type | Purpose |
|-----|------|---------|
| `isLoggedIn` | string | Auth state ("true"/"false") |
| `userUid` | string | Firebase user ID |
| `userAge` | number | Calculated age for routing |

### Age Calculation Logic

```javascript
function calculateAge(dobString) {
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
```

### Dynamic Navigation Routing

```javascript
// Route "Learn" link based on user age
const userAge = parseInt(sessionStorage.getItem('userAge'), 10);
if (userAge >= 12 && userAge < 16) {
    learnLink.href = 'learn_juniors.html';
} else if (userAge >= 16 && userAge < 18) {
    learnLink.href = 'learn_seniors.html';
} else {
    learnLink.href = 'learn.html';
}
```

### CSS Architecture

**`css/style.css` - Design System:**

```css
:root {
    /* Color tokens */
    --primary: #4f46e5;
    --primary-dark: #4338ca;
    --text-primary: #1f2937;
    --bg-primary: #ffffff;
    
    /* Spacing scale */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: 1.5rem;
    --space-xl: 2rem;
}

[data-theme="dark"] {
    --text-primary: #f9fafb;
    --bg-primary: #111827;
}
```

**Component Classes:**
- `.btn`, `.btn-primary`, `.btn-ghost` - Button variants
- `.card`, `.card-glass` - Card containers
- `.navbar`, `.navbar-links` - Navigation
- `.hero`, `.hero-content` - Hero sections

**`css/animations.css`:**
- Scroll-triggered animations via `IntersectionObserver`
- Keyframe definitions (`fadeIn`, `slideUp`, `pulse`)
- Hover state transitions

### UI Components (`js/components.js`)

| Class | Purpose |
|-------|---------|
| `MobileNavigation` | Hamburger menu toggle, overlay |
| `ScrollAnimations` | IntersectionObserver for reveal effects |
| `CounterAnimation` | Animated number counters |
| `TypingEffect` | Typewriter text animation |
| `ThemeToggle` | Dark/light mode switch |
| `ScrollToTop` | Floating back-to-top button |

### Calculator Implementation Pattern

Each calculator in `application/tools.html` follows:

```javascript
// 1. Get DOM elements
const input = document.getElementById('principal');
const result = document.getElementById('result');

// 2. Add event listeners
input.addEventListener('input', calculate);

// 3. Calculate and update
function calculate() {
    const value = parseFloat(input.value) || 0;
    const computed = /* formula */;
    result.textContent = computed.toLocaleString('en-IN');
}
```

### Challenge Game Pattern

Each challenge in `application/challenges.html`:

```javascript
const challengesData = [
    { id: 'budget-boss', title: '...', difficulty: 'easy' },
    // ...
];

function renderChallengeContent(challengeId) {
    // Build HTML based on challenge type
    // Set up event listeners
    // Handle game logic
}

function openModal(challengeId) {
    renderChallengeContent(challengeId);
    modal.classList.add('active');
}
```

### Error Handling

Firebase auth errors mapped to user-friendly messages:

```javascript
const errorMessages = {
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'Account already exists.',
    'auth/weak-password': 'Password too weak (min 8 chars).',
    'auth/invalid-email': 'Invalid email format.',
    'auth/too-many-requests': 'Too many attempts. Try later.'
};
```

---

## Security Considerations

### Firebase Security Rules (Recommended)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null 
                         && request.auth.uid == userId;
    }
  }
}
```

### Domain Restrictions

In Firebase Console → Authentication → Settings:
- Add `appfinsmart.netlify.app`
- Add `localhost` (for development)

---

## Firestore Data Model

```
users/
  └── {userId}/
        ├── name: string
        ├── email: string
        ├── dob: string (YYYY-MM-DD)
        └── createdAt: timestamp
```

---

## Deployment

The project is hosted on Netlify. To deploy updates:

```bash
# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Login and link (first time only)
netlify login
netlify link

# Deploy to production
netlify deploy --prod
```

---

## Local Development

Simply open any HTML file in a browser. No build step required.

For Firebase to work locally, ensure `localhost` is added to Firebase Console → Authentication → Settings → Authorized domains.

---

## License

This project is for educational purposes.
