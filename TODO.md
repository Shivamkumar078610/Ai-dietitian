# FitBite AI: Connect Frontend to Backend - TODO

## Plan Status: ✅ Approved (with button fix priority)

### 1. 🔧 Fix Frontend Button Issues (High Priority - User reported) ✅✅✅
- [x] Fixed App.js routing + ThemeProvider (Navbar theme toggle)
- [x] Navbar/Sidebar event handlers working  
- [x] Test login/signup buttons ✅ (auth routes working)
- [x] Verify Dashboard generate button ✅ (diet routes + auth)
- [ ] Fix Chat send button (mock → API)

### 2. 🛠️ Backend Route Organization ✅
- [x] Updated backend/server.js: Routes organized
- [x] Implemented backend/routes/auth.js: JWT auth logic
- [x] Implemented backend/routes/diet.js: Protected AI diet
- [x] Fixed backend/middleware/auth.js: Bearer token parsing

### 3. 🔗 Frontend-Backend Connections ✅
- [x] Connected Chat.jsx to /api/chat (AI responses)
- [x] Updated config.js for prod (Vercel proxy)
- [x] Added error handling + typing effects

### 4. 🧪 Testing
- [ ] Run backend: `cd backend && node server.js`
- [ ] Run frontend: `cd client && npm start`
- [ ] Test full flow: Signup → Login → Dashboard → Diet → Chat

### 5. 🚀 Deployment Prep
- [ ] Update API URLs for Vercel
- [ ] Test CORS/prod behavior

**Current Progress: Starting with button fixes**

