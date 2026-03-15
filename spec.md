# Wedding Card Designer

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- A wedding card design website where users can browse templates, customize card details, and preview/download their card
- Multiple wedding card templates with different visual styles
- Card editor: couple names, wedding date, venue, personal message
- Live preview of the card as user types
- Download card as image functionality
- Gallery of pre-built templates to choose from
- Saved designs stored in backend (per session or named)

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend: store saved card designs (template ID, custom text fields, created timestamp)
2. Frontend: template gallery page, card editor with live preview, download functionality
3. Templates: at least 6 distinct wedding card designs rendered in-browser using CSS/canvas
4. Editor fields: partner 1 name, partner 2 name, date, venue, message, RSVP details
5. Live preview panel updates in real-time as user edits
6. Download card using html2canvas or similar approach
