Responsive updates and QA steps

Overview
- Added mobile hamburger menu and responsive CSS to support phones and tablets.
- Improved layout, hero, courses grid, search and forms for small screens.

What I changed
- `src/components/Navbar.js`: added a hamburger toggle and aria attributes for accessibility.
- `src/App.css`: added stylesheet rules for the toggle button, mobile menu, and responsive breakpoints (<=1024px, <=768px). Improved hero and courses grid responsiveness.

Manual QA steps ✅
1. Start the dev server: `npm start` in `edulearn-frontend`.
2. Open the app in a desktop browser and resize the window to tablet and phone widths (or use Chrome DevTools device toolbar).
3. Verify:
   - Navbar shows a hamburger toggle at small widths and menu opens/closes.
   - Menu items stack vertically and the Sign In / Logout button spans full width on mobile.
   - The hero section reduces text size and buttons stack on small screens.
   - Courses grid stacks to a single column on small phones and becomes two/three columns on larger tablets.
   - Forms and search input stretch to full width on mobile.
4. Test keyboard navigation: Tab to hamburger, press Enter to open/close, and navigate links.

Notes
- If you want a slide-out mobile drawer or animation, I can add it next.
- I left the current design language intact and focused on minimal, accessible changes.

Let me know if you want further tweaks (e.g., different breakpoints, full mobile nav animation, or additional responsive adjustments).