# TODO - Next Features & Improvements

## High Priority

### 🔄 Reset Roster Button
- Add "Reset Roster" button to the roster builder
- Should clear all unit wounds back to full health
- Confirm dialog: "Reset all units to full health? This cannot be undone."
- Location: Likely in the Header or Footer component
- Behavior: Resets `woundState` to initial values, does NOT clear roster data

### 📊 Review Update Stats Placement
- Review where unit stats are currently displayed (UnitCard, UnitDetailModal)
- Evaluate if stats layout is clear and accessible
- Consider mobile responsiveness of stat display
- May need to reorganize stat columns/rows for better UX
- Check if all relevant stats are visible at a glance

### ⚙️ Game Settings Button Review
- Review GameOptions page layout and functionality
- Evaluate if button placement is intuitive
- Consider adding settings for:
  - Turn limit
  - Victory conditions
  - Custom scoring rules
  - Other game-specific options
- Ensure settings persist in session state
- Test on mobile layout

## Implementation Notes

- All three items should use branches (branch workflow)
- Consider creating individual issues for each if needed
- Update session persistence if new state needs to be saved
- Test mobile responsiveness for each feature
