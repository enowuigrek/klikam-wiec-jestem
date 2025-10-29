<div align="center">
  <h1>⚡ ZDK - Klikam więc jestem</h1>
  <p>Filozoficzny symulator polskiego pracownika. Idle clicker game z prestige systemem i systemem podatków.</p>

[![Live Game](https://img.shields.io/badge/Play-klikam--wiec--jestem.netlify.app-success?style=for-the-badge)](https://klikam-wiec-jestem.netlify.app)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://netlify.com/)
</div>

---

# ZDK - Klikam więc jestem

## 🎮 Project Preview

<div align="center">
  <table>
    <tr>
      <td align="center" width="50%">
        <strong>🎯 Idle Clicker Game</strong>
        <br/>
        <em>"Klikam więc jestem" - Polish Worker Simulator</em>
      </td>
      <td align="center" width="50%">
        <strong>🌐 Live Game</strong>
        <br/>
        <a href="https://klikam-wiec-jestem.netlify.app">Play Now!</a>
      </td>
    </tr>
  </table>

**🎨 Dynamic Day/Night Cycle** | **💰 Tax System** | **⭐ Prestige Mechanics** | **🏆 17 Achievements**
</div>

---

## 🚀 Tech Stack

- **Frontend:** Vanilla JavaScript (ES6+)
- **Styling:** CSS3 with CSS Grid & Flexbox
- **Storage:** LocalStorage API
- **Audio:** Web Audio API
- **PWA:** Progressive Web App ready
- **Icons:** Emoji + Unicode
- **Deployment:** Netlify

## ✨ Features

### 🎯 **Core Gameplay**
- [x] **Escaping button** - Click ZDK button that moves away
- [x] **Progressive difficulty** - Button speed increases every 100 clicks
- [x] **Smart positioning** - Button avoids UI elements
- [x] **Collision detection** - Never overlaps with panels
- [x] **Smooth transitions** - Easing animations based on speed level

### 💰 **Economy System**
- [x] **Bonus system** - 2.09 zł every 100 clicks
- [x] **Prestige multiplier** - +10% bonus per prestige level
- [x] **Tax calculator** - PIT, ZUS, NFZ, health insurance
- [x] **Withdraw system** - Always 0 zł after taxes (Polish reality!)
- [x] **Progressive income** - Grows with prestige levels

### ⭐ **Prestige System**
- [x] **Reset at 10,000 clicks** - Start over with permanent bonuses
- [x] **Permanent +10% bonus** - Per prestige level
- [x] **Keeps achievements** - Progress carries over
- [x] **Speed reset** - Start fresh with level 1 speed
- [x] **Strategic gameplay** - Risk vs reward decision

### 🏆 **Achievement System (17 Total)**
- [x] **Progress tracking** - 👶 First Step → 🌟 God of Clicking
- [x] **Milestone rewards** - 50, 100, 500, 1k, 2.5k, 5k, 10k clicks
- [x] **Bonus achievements** - First bonus, 10 zł, 50 zł, 100 zł
- [x] **Speed achievements** - ⚡ Master Clicker (level 10)
- [x] **Prestige achievements** - 🔄 Reincarnation, ✨ Enlightened
- [x] **Time traveler** - ⏰ See all times of day
- [x] **Real-time notifications** - Popup when unlocked
- [x] **Progress display** - Current/total tracking

### 🌅 **Day/Night Cycle**
- [x] **7 time periods** - Dawn → Morning → Noon → Afternoon → Dusk → Evening → Night
- [x] **Dynamic sky colors** - Smooth gradient transitions
- [x] **Moving sun/moon** - Realistic celestial movement
- [x] **Room lighting** - Walls and floor change with time
- [x] **Smart lamp** - Automatically lights up at night (evening + night)
- [x] **Window glow effect** - Light spreads into the room
- [x] **Changes every 20 clicks** - Visible progress

### 💾 **Data Persistence**
- [x] **Auto-save system** - Saves every 5 seconds
- [x] **Click-based saves** - After every click
- [x] **Progress retention** - Clicks, bonus, prestige, achievements
- [x] **Time period memory** - Resumes from last session
- [x] **Speed level tracking** - Button difficulty persists

### 📱 **Progressive Web App**
- [x] **iOS app icon** - Custom ZDK icon (192x192 PNG)
- [x] **Android support** - Full PWA manifest
- [x] **Add to home screen** - Works like native app
- [x] **Offline capability** - Plays without internet
- [x] **Installation instructions** - On title screen

### 🎨 **Visual Design**
- [x] **Pixel art aesthetic** - Retro-modern hybrid style
- [x] **Gradient backgrounds** - Dynamic color schemes
- [x] **Glassmorphism UI** - Transparent panels with blur
- [x] **Smooth animations** - CSS transitions and transforms
- [x] **Responsive layout** - Desktop and mobile optimized
- [x] **2x2 button grid** - Mobile-friendly action buttons

### 🔊 **Audio System**
- [x] **Click sound** - Simple beep on button click
- [x] **Achievement sound** - Melodic notification
- [x] **Web Audio API** - No external files needed
- [x] **Dynamic generation** - Procedural audio

### 📤 **Social Features**
- [x] **Share results** - Click count, bonus, prestige, achievements
- [x] **Native sharing** - Mobile share API support
- [x] **Clipboard fallback** - Copy to clipboard on desktop
- [x] **Formatted text** - Ready to paste

### 🎭 **Game Philosophy**
- [x] **Polish worker satire** - Tax system humor
- [x] **Existential title** - "I click therefore I am"
- [x] **Reward futility** - Always 0 zł after taxes
- [x] **Grinding mechanic** - Encourages persistence
- [x] **Progress illusion** - Prestige system loop

## 📁 Project Structure

```
klikam-wiec-jestem/
├── index.html              # Main game file (single-page app)
├── icon-192.png            # iOS/Android app icon
├── generate-icon.html      # Icon generator utility
├── README.md               # This file
└── .git/                   # Git repository
```

**Single File Architecture:**
- All HTML, CSS, and JavaScript in `index.html`
- No build process required
- Instant deployment ready
- Easy to modify and customize

## 🛠️ Development

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code, Sublime, etc.)
- Optional: Local web server for testing

### Local Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/klikam-wiec-jestem.git
cd klikam-wiec-jestem

# Open in browser
# Option 1: Double-click index.html
# Option 2: Use local server
python -m http.server 8000
# Then visit http://localhost:8000
```

### Making Changes
1. Open `index.html` in your editor
2. Modify HTML/CSS/JavaScript as needed
3. Refresh browser to see changes
4. No build step required!

## 🎮 Gameplay Guide

### **How to Play**
1. **Click the ZDK button** - It will escape and move to a new position
2. **Earn bonus** - Every 100 clicks = 2.09 zł bonus
3. **Speed increases** - Button gets faster every 100 clicks
4. **Time passes** - Watch the room change from dawn to night
5. **Unlock achievements** - 17 total achievements to earn
6. **Prestige at 10k** - Reset for permanent +10% bonus

### **Strategy Tips**
- **Don't withdraw early** - Let bonus accumulate for better prestige
- **Track achievements** - Some give permanent benefits
- **Prestige timing** - Wait until 10k for first prestige
- **Speed management** - Higher speed = harder clicking
- **Day/night cycle** - Watch the lamp turn on at night

### **Tax Breakdown**
When you withdraw your bonus:
- **PIT** (32%) - Income tax
- **ZUS** (28%) - Social security
- **NFZ** (9%) - Healthcare fund
- **Health insurance** (12%) - Additional healthcare
- **Bonus tax** (19%) - Special bonus tax
- **Result:** 0.00 zł (Welcome to Poland! 🇵🇱)

## 🌟 Key Highlights

### **Game Mechanics**
- **Idle clicker foundation** - Click → Earn → Upgrade loop
- **Prestige system** - New Game+ mechanics
- **Achievement hunting** - 17 goals to complete
- **Tax satire** - Polish tax system humor

### **Technical Implementation**
- **Pure JavaScript** - No frameworks or libraries
- **CSS Grid/Flexbox** - Modern responsive layout
- **Web Audio API** - Procedural sound generation
- **LocalStorage** - Client-side save system
- **PWA ready** - Installable on mobile devices

### **Polish Features**
- **Collision avoidance** - Button never overlaps UI
- **Smart positioning** - 100 attempts to find good spot
- **Progressive speed** - Difficulty scales with progress
- **Time transitions** - Smooth 2-second color changes

## 📱 Mobile Optimization

### **Responsive Design**
- **Touch-friendly buttons** - Large tap targets
- **Mobile-first layout** - Optimized for small screens
- **Grid system** - 2x2 button arrangement on mobile
- **Scaled elements** - Furniture and decorations resize

### **PWA Features**
- **App icon** - ZDK logo on home screen
- **Splash screen** - Custom loading screen
- **Standalone mode** - Fullscreen app experience
- **Offline support** - Works without connection

### **Installation**
On iOS Safari:
1. Open game in Safari
2. Tap Share button
3. Select "Add to Home Screen"
4. Game appears as app icon

On Android Chrome:
1. Open game in Chrome
2. Tap menu (⋮)
3. Select "Add to Home screen"
4. Install as app

## 🎨 Visual Features

### **Room Elements**
- **Window** - Shows sky with sun/moon
- **Window light** - Glow effect spreads into room
- **Smart lamp** - Auto-lights at night
- **Gradient walls** - Change color with time of day
- **Patterned floor** - Striped tile design

### **UI Design**
- **Glassmorphism panels** - Transparent with blur
- **Color-coded stats** - Green (clicks), Gold (bonus), Blue (prestige)
- **Emoji indicators** - Visual feedback
- **Smooth animations** - Professional transitions

## 💡 Future Enhancements

### **Potential Features**
- [ ] Upgrade shop - Speed reducers, auto-clickers
- [ ] Leaderboard - Online high scores
- [ ] More rooms - Kitchen, bedroom, office
- [ ] Weather effects - Rain, snow in window
- [ ] Music player - Background ambient music
- [ ] Language options - English translation
- [ ] Theme customization - Color schemes
- [ ] Daily challenges - Special objectives

### **Technical Improvements**
- [ ] Component architecture - Modular JavaScript
- [ ] TypeScript conversion - Type safety
- [ ] Service worker - Better offline support
- [ ] Analytics integration - Usage tracking
- [ ] A/B testing - Feature experiments

## 🌐 Deployment

**Status:** ✅ **LIVE IN PRODUCTION**

- **Hosting:** Netlify
- **Domain:** [klikam-wiec-jestem.netlify.app](https://klikam-wiec-jestem.netlify.app)
- **SSL:** Active HTTPS
- **Status:** Fully functional game

### **Deploy Your Own**

**Netlify (Drag & Drop):**
1. Go to [netlify.com/drop](https://netlify.com/drop)
2. Drag the project folder
3. Get instant live URL!

**GitHub Pages:**
```bash
# Enable GitHub Pages in repo settings
# Select main branch
# Visit: https://yourusername.github.io/klikam-wiec-jestem
```

**Custom Domain:**
1. Update `og:url` meta tags in HTML
2. Update `icon-192.png` reference
3. Configure DNS settings
4. Deploy!

## 📊 Game Statistics

### **Progression System**
- **Clicks:** Unlimited (JavaScript safe integers)
- **Max bonus:** No limit (grows with prestige)
- **Prestige levels:** Unlimited (compound bonuses)
- **Achievements:** 17 total (expandable)
- **Speed levels:** No cap (gets impossibly fast!)

### **Time Metrics**
- **Average playtime:** 30-60 minutes to prestige
- **Achievement completion:** 2-3 hours for all
- **Speed level 10:** ~1000 clicks (~15 minutes)
- **First prestige:** ~10,000 clicks (~30 minutes)

## 📞 Contact

**Developer:** [Łukasz Nowak](https://github.com/enowuigrek)

- **Email:** enowuigrek@gmail.com
- **GitHub:** [@enowuigrek](https://github.com/enowuigrek)
- **Location:** Łódź, Poland 🇵🇱

### **Report Issues**
Found a bug? Have a suggestion?
- Open an issue on GitHub
- Send an email with details
- Include browser and OS info

---

## 🎮 Game Credits

**Concept & Development:** [Łukasz Nowak](https://github.com/enowuigrek)  
**Inspiration:** Polish tax system 💸  
**Built with:** Pure JavaScript + CSS3  
**Powered by:** Caffeine ☕ and existential dread

---

## 🏆 Technical Achievements

✅ **Pure Vanilla JS** - No frameworks or libraries  
✅ **Single File App** - Complete game in one HTML file  
✅ **PWA Ready** - Installable on mobile devices  
✅ **LocalStorage Persistence** - Save system works offline  
✅ **Web Audio API** - Procedural sound generation  
✅ **Responsive Design** - Mobile-first approach  
✅ **Smart Collision Detection** - Advanced positioning algorithm  
✅ **Achievement System** - Complete tracking and notifications  
✅ **Prestige Mechanics** - New Game+ implementation  
🎮 **Fully Playable** - Production-ready game

---

Made with ❤️ (and frustration with taxes) | Vanilla JS + CSS3 | Łódź, Poland 🇵🇱

*"Klikam więc jestem" - René Descartes, probably*