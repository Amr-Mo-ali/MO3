# MO3 Production - QA Testing Checklist

**Project**: MO3 Production Website Redesign with Contemporary Design System
**Date**: April 18, 2026
**Tester Name**: _______________________
**Browser/OS**: _______________________

---

## ✓ PRE-TEST CHECKLIST

- [ ] Development server running (`npm run dev`)
- [ ] Site accessible at `http://localhost:3000`
- [ ] Browser DevTools open for inspection
- [ ] No console errors visible
- [ ] All pages load without errors

---

## 1. KEYBOARD NAVIGATION TESTS

### 1.1 Tab Navigation
- [ ] Click page, press Tab
- [ ] Focus indicator (2px purple outline) appears
- [ ] Tab moves through elements in logical order
- [ ] Elements focused: Logo → Nav (4) → Theme → Mobile Menu → Social (4) → Buttons
- [ ] No elements skipped in tab order

**Notes**: _________________________________

### 1.2 Tab Through Navigation
- [ ] Logo is focusable and clickable
- [ ] "Work" link is focusable
- [ ] "About" link is focusable
- [ ] "Clients" link is focusable
- [ ] "Contact" link is focusable
- [ ] Theme toggle is focusable
- [ ] All show 2px purple focus outline

**Notes**: _________________________________

### 1.3 Tab Through Buttons
- [ ] Mobile menu button is focusable (on small screens)
- [ ] All CTA buttons are focusable
- [ ] Form submit buttons are focusable
- [ ] Close buttons are focusable
- [ ] All show focus outline

**Notes**: _________________________________

### 1.4 Shift+Tab Navigation (Reverse)
- [ ] Hold Shift, press Tab
- [ ] Focus moves backward through elements
- [ ] Same focus indicators visible
- [ ] Can reach all elements in reverse order

**Notes**: _________________________________

---

## 2. ESC KEY TESTS

### 2.1 ESC Closes Mobile Menu
- [ ] Resize to mobile size (~375px width)
- [ ] Click mobile menu button (hamburger)
- [ ] Menu opens and displays nav items
- [ ] Press ESC key
- [ ] Menu closes smoothly
- [ ] Focus returns to menu button

**Notes**: _________________________________

### 2.2 ESC Closes Video Modal
- [ ] Navigate to "Work" section
- [ ] Click any work thumbnail to open video
- [ ] Video lightbox modal opens
- [ ] Press ESC key
- [ ] Modal closes smoothly
- [ ] Page scrolling restored
- [ ] Focus returns to work card

**Notes**: _________________________________

### 2.3 Multiple ESC Presses
- [ ] Open modal, press ESC multiple times
- [ ] No errors occur
- [ ] Modal stays closed

**Notes**: _________________________________

---

## 3. FOCUS INDICATOR VISIBILITY

### 3.1 Button Focus States
- [ ] Theme toggle button: shows 2px purple outline when Tab focused
- [ ] Mobile menu: shows outline
- [ ] All CTA buttons: show outline
- [ ] Outline is 2px offset from button border

**Color Check**:
- [ ] Outline color is #C800DF (purple)
- [ ] Outline visible on both dark and light modes
- [ ] Contrast sufficient

**Notes**: _________________________________

### 3.2 Link Focus States
- [ ] Navigation links show outline
- [ ] Social media links show outline
- [ ] All outlines 2px solid
- [ ] Outline offset 2px

**Notes**: _________________________________

### 3.3 Form Input Focus States
- [ ] Text input shows outline when focused
- [ ] Border color changes to purple
- [ ] Optional: Glow effect visible
- [ ] All form elements (text, email, password) show focus indicator

**Notes**: _________________________________

### 3.4 Focus NOT Visible on Mouse Click
- [ ] Click button with mouse
- [ ] NO outline appears
- [ ] Press Tab to same button
- [ ] Outline NOW appears
- [ ] This is expected behavior (UX improvement)

**Notes**: _________________________________

---

## 4. COLOR RENDERING TESTS

### 4.1 Dark Mode Colors
- [ ] Theme set to Dark
- [ ] Background is black (#000000)
- [ ] Text is white (#FFFFFF)
- [ ] Surfaces are dark gray (#111111)
- [ ] Borders are subtle (#222222)
- [ ] Primary accent is purple (#C800DF)
- [ ] Secondary accent is pink (#E60076)

**Notes**: _________________________________

### 4.2 Light Mode Colors
- [ ] Click theme toggle to switch to Light
- [ ] Background turns light gray (#F5F5F5)
- [ ] Text turns dark (#111111)
- [ ] Surfaces are white (#FFFFFF)
- [ ] Borders are light (#DDDDDD)
- [ ] Primary accent still purple (#C800DF)
- [ ] Secondary accent still pink (#E60076)

**Notes**: _________________________________

### 4.3 Color Contrast Verification
- [ ] Dark mode text readable (WCAG AA minimum: 4.5:1)
- [ ] Light mode text readable
- [ ] Primary color (#C800DF) has sufficient contrast
- [ ] No text is unreadable in either mode

**Notes**: _________________________________

### 4.4 Old Red Color Removed
- [ ] Open browser DevTools (F12)
- [ ] Search for "#E31212" in console or code
- [ ] Zero matches found
- [ ] All old red replaced with new colors

**Notes**: _________________________________

### 4.5 Gradient & Shadow Colors
- [ ] Gradients use appropriate colors
- [ ] Shadows are visible but subtle
- [ ] No harsh color combinations

**Notes**: _________________________________

---

## 5. TOUCH TARGET SIZE TESTS

### 5.1 Button Sizes (44px minimum)
- [ ] Open DevTools (F12)
- [ ] Inspect theme toggle button
- [ ] Check height: 44px ✓
- [ ] Check width: 44px ✓

**Notes**: _________________________________

### 5.2 Mobile Menu Button Size
- [ ] Inspect mobile menu button
- [ ] Height: 44px ✓
- [ ] Width: 44px ✓

**Notes**: _________________________________

### 5.3 All CTA Buttons
- [ ] Inspect "Let's Collaborate" buttons
- [ ] Height: ≥44px ✓
- [ ] Width: ≥44px ✓

**Notes**: _________________________________

### 5.4 Mobile Touch Test
- [ ] Test on actual mobile device or small screen
- [ ] Try to tap all buttons
- [ ] All buttons easy to tap (no mis-taps)
- [ ] Spacing between buttons adequate

**Notes**: _________________________________

---

## 6. CUSTOM CURSOR BEHAVIOR

### 6.1 Cursor Appears on Mouse Move
- [ ] Move mouse around page
- [ ] Custom purple ring appears
- [ ] White dot in center visible
- [ ] Smooth following animation
- [ ] No native arrow cursor visible

**Notes**: _________________________________

### 6.2 Cursor Hides on Tab Key
- [ ] Custom cursor visible (move mouse)
- [ ] Press Tab key
- [ ] Custom cursor disappears
- [ ] Native cursor (arrow) appears
- [ ] Move mouse after Tab
- [ ] Custom cursor reappears

**Notes**: _________________________________

### 6.3 Cursor Active State (Click)
- [ ] Custom cursor visible
- [ ] Press and hold mouse button
- [ ] Cursor ring changes color (to pink #E60076)
- [ ] Release mouse button
- [ ] Color returns to purple #C800DF

**Notes**: _________________________________

### 6.4 Cursor Disabled on Touch
- [ ] Test on tablet or mobile device
- [ ] Custom cursor should NOT appear
- [ ] Native touch cursor used instead

**Notes**: _________________________________

---

## 7. SCREEN READER TESTING

### 7.1 Screen Reader Setup
- [ ] NVDA installed (Windows) OR
- [ ] JAWS installed OR
- [ ] VoiceOver enabled (Mac/iOS)

### 7.2 Navigation Announcement
- [ ] Start screen reader
- [ ] Navigate to header
- [ ] Screen reader announces "navigation"
- [ ] Press Down arrow or Right arrow
- [ ] Elements announced: "Work link", "About link", "Clients link", "Contact link"

**Notes**: _________________________________

### 7.3 Button Labels
- [ ] Tab to theme toggle
- [ ] Screen reader announces: "Toggle between light and dark theme, button"
- [ ] Tab to mobile menu
- [ ] Screen reader announces: "Open menu, button" or "Close menu, button"

**Notes**: _________________________________

### 7.4 Social Links
- [ ] Tab through social media links
- [ ] Each announced with name: "Instagram link", "Facebook link", "Behance link", "Phone link"

**Notes**: _________________________________

### 7.5 Form Inputs
- [ ] Tab to any form input
- [ ] Screen reader announces: "[Label], edit text" or "[Label], required"

**Notes**: _________________________________

### 7.6 Modal Dialog
- [ ] Open video modal
- [ ] Screen reader announces: "dialog"
- [ ] Press Tab
- [ ] Focus moves through modal content

**Notes**: _________________________________

---

## 8. THEME TOGGLE TESTS

### 8.1 Toggle Switches Themes
- [ ] Observe current theme (dark or light)
- [ ] Click theme toggle button
- [ ] Theme switches (animation smooth, 0.3s)
- [ ] Background changes color
- [ ] Text changes color
- [ ] Click again
- [ ] Theme switches back

**Notes**: _________________________________

### 8.2 Theme Persists on Reload
- [ ] Switch to Light mode
- [ ] Note the theme
- [ ] Press F5 to reload page
- [ ] Page loads in Light mode ✓
- [ ] Switch to Dark mode
- [ ] Reload page
- [ ] Page loads in Dark mode ✓

**Notes**: _________________________________

### 8.3 Theme Icon Changes
- [ ] Dark mode: Moon icon visible in toggle
- [ ] Click toggle
- [ ] Light mode: Sun icon visible
- [ ] Click toggle
- [ ] Dark mode: Moon icon again

**Notes**: _________________________________

### 8.4 All Colors Change with Theme
- [ ] Switch to Light mode
- [ ] Check: backgrounds, text, borders all change
- [ ] Switch to Dark mode
- [ ] Check: all colors return to original

**Notes**: _________________________________

---

## 9. FONT RENDERING TESTS

### 9.1 Jost Font Loaded
- [ ] DevTools → Sources → Fonts
- [ ] "Jost" font visible in list
- [ ] All weights available (100, 200, ... 900)

**Notes**: _________________________________

### 9.2 Overpass Mono Font Loaded
- [ ] DevTools → Sources → Fonts
- [ ] "Overpass Mono" visible in list
- [ ] Weights 400 and 700 available

**Notes**: _________________________________

### 9.3 Text Renders Correctly
- [ ] Headings use Jost (display font)
- [ ] Body text uses Jost (sans font)
- [ ] All text readable and properly spaced

**Notes**: _________________________________

---

## 10. ACCESSIBILITY STANDARDS COMPLIANCE

### 10.1 WCAG 2.2 AA Checklist
- [ ] **1.3.1 Info & Relationships**: Semantic HTML structure ✓
- [ ] **1.4.3 Contrast**: All text 4.5:1+ contrast ✓
- [ ] **1.4.11 Non-text Contrast**: Focus indicator 6.3:1+ ✓
- [ ] **2.1.1 Keyboard**: All functions keyboard accessible ✓
- [ ] **2.1.2 No Keyboard Trap**: Can exit menus/modals with ESC ✓
- [ ] **2.4.3 Focus Order**: Tab order logical and visible ✓
- [ ] **2.4.7 Focus Visible**: Outline always visible ✓
- [ ] **2.5.5 Target Size**: All targets 44×44px minimum ✓
- [ ] **4.1.2 Name, Role, Value**: ARIA labels present ✓
- [ ] **4.1.3 Status Messages**: Dialogs properly marked ✓

**Overall Compliance Level**: WCAG 2.2 AA ✓

**Notes**: _________________________________

---

## 11. BROWSER COMPATIBILITY TESTS

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | [ ] | ☐ Pass ☐ Fail | ____________ |
| Firefox | [ ] | ☐ Pass ☐ Fail | ____________ |
| Safari | [ ] | ☐ Pass ☐ Fail | ____________ |
| Edge | [ ] | ☐ Pass ☐ Fail | ____________ |

**Notes**: _________________________________

---

## 12. RESPONSIVE DESIGN TESTS

### Mobile (375px)
- [ ] All elements properly sized
- [ ] Touch targets accessible
- [ ] No horizontal scroll
- [ ] Mobile menu works

### Tablet (768px)
- [ ] Layout adapts correctly
- [ ] Navigation shows/hides appropriately

### Desktop (1200px+)
- [ ] Desktop navigation visible
- [ ] All features functional
- [ ] No layout issues

**Notes**: _________________________________

---

## 13. PERFORMANCE TESTS

- [ ] Page loads quickly
- [ ] No lag in transitions
- [ ] Animations smooth (60fps)
- [ ] No layout shift when focusing elements
- [ ] Theme toggle instant
- [ ] Custom cursor smooth

**Notes**: _________________________________

---

## 14. BUG TRACKING

### Found Issues

| # | Issue | Severity | Status | Fix |
|---|-------|----------|--------|-----|
| 1 | | ☐ Critical ☐ High ☐ Medium ☐ Low | ☐ Open ☐ Closed | |
| 2 | | ☐ Critical ☐ High ☐ Medium ☐ Low | ☐ Open ☐ Closed | |
| 3 | | ☐ Critical ☐ High ☐ Medium ☐ Low | ☐ Open ☐ Closed | |

---

## FINAL TEST SUMMARY

| Category | Passed | Failed | Status |
|----------|--------|--------|--------|
| Keyboard Navigation | ☐ | ☐ | ☐ Pass ☐ Fail |
| ESC Key | ☐ | ☐ | ☐ Pass ☐ Fail |
| Focus Indicators | ☐ | ☐ | ☐ Pass ☐ Fail |
| Color Rendering | ☐ | ☐ | ☐ Pass ☐ Fail |
| Touch Targets | ☐ | ☐ | ☐ Pass ☐ Fail |
| Custom Cursor | ☐ | ☐ | ☐ Pass ☐ Fail |
| Screen Readers | ☐ | ☐ | ☐ Pass ☐ Fail |
| Theme Toggle | ☐ | ☐ | ☐ Pass ☐ Fail |
| Fonts | ☐ | ☐ | ☐ Pass ☐ Fail |
| A11y Standards | ☐ | ☐ | ☐ Pass ☐ Fail |
| **TOTAL** | ☐ | ☐ | **☐ PASS ☐ FAIL** |

---

## APPROVAL & SIGN-OFF

### Test Execution
- **Tester Name**: _______________________
- **Date Tested**: _______________________
- **Time Spent**: _______________________
- **Browser/OS**: _______________________

### Test Results
- **Overall Status**: ☐ PASS ☐ FAIL
- **Critical Issues**: ☐ 0 ☐ 1+ 
- **Ready for Deployment**: ☐ YES ☐ NO

### Sign-Off

**QA Tester Signature**: _________________________ **Date**: _________

**Project Lead Signature**: _________________________ **Date**: _________

**Notes & Recommendations**:
___________________________________________________________________
___________________________________________________________________
___________________________________________________________________

---

## REFERENCE MATERIALS

- Test Guide: [TESTING_GUIDE.md](TESTING_GUIDE.md)
- Test Report: [TEST_REPORT.md](TEST_REPORT.md)
- Design System: [contemporary-SKILL.md](contemporary-SKILL.md)
- Files Modified: 11 files updated
- Total Tests: 33 tests created

---

**Good luck with testing! 🚀**
