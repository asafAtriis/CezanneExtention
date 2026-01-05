# Changelog

```json
{
  "entries": [
    {
      "id": 1,
      "date": "2026-01-04",
      "task": "Project Scaffold & Manifest",
      "implementation": "Created Manifest V3 extension structure with permissions for activeTab, storage, and scripting. Set up host permissions for cezannehr.com and cezanneondemand.com domains. Created popup and content script directories."
    },
    {
      "id": 2,
      "date": "2026-01-04",
      "task": "Develop Popup UI",
      "implementation": "Built complete popup interface with date range selectors, time inputs (start/end), and skip weekends toggle. Implemented local storage persistence for all settings and message passing to content script."
    },
    {
      "id": 3,
      "date": "2026-01-04",
      "task": "Implement Content Script Core Logic",
      "implementation": "Built DOM automation engine with flexible selectors for calendar grids, day cells, and modals. Implemented MutationObserver-based element waiting, native input value injection with event dispatching (input/change/keyup), and form submission handling."
    },
    {
      "id": 4,
      "date": "2026-01-04",
      "task": "Implement Date Iteration & Error Handling",
      "implementation": "Added date range generation with weekend skipping, sequential day processing with configurable delays, failure counting (stops after 3 failures), loading state detection, and stop-on-request functionality via message passing."
    },
    {
      "id": 5,
      "date": "2026-01-04",
      "task": "Create README documentation",
      "implementation": "Created comprehensive README.md covering project overview, development setup, production deployment, DOM selector customization guide, and troubleshooting."
    },
    {
      "id": 6,
      "date": "2026-01-05",
      "task": "Fix Cezanne HR DOM selectors",
      "implementation": "Updated content script with correct selectors for Cezanne HR: Add New button, Clock In/Out sections, mat-datepicker-input for dates, kendo-timepicker for times, and Save button. Implemented proper flow: Add New -> Fill dates -> Fill times -> Save."
    },
    {
      "id": 7,
      "date": "2026-01-05",
      "task": "Fix time input format and typing",
      "implementation": "Changed time format from HH:mm to HH:mm:ss. Implemented character-by-character typing simulation using execCommand('insertText') to properly trigger Kendo UI timepicker validation."
    },
    {
      "id": 8,
      "date": "2026-01-05",
      "task": "Fix form transition after save",
      "implementation": "Added click-outside-to-close functionality after save to dismiss overlay/modal. Implemented detection of .cz-view-stack-overlay and fallback to main content click for proper form closure between iterations."
    },
    {
      "id": 9,
      "date": "2026-01-05",
      "task": "Fix date range generation",
      "implementation": "Rewrote date range function to be timezone-safe and properly include end date. Fixed iteration logic to handle month/year boundaries correctly."
    },
    {
      "id": 10,
      "date": "2026-01-05",
      "task": "Add weekend type selection",
      "implementation": "Added dropdown to select weekend type: Israel (Friday-Saturday) or International (Saturday-Sunday). Default set to Israel. Dropdown only visible when Skip Weekends is enabled."
    },
    {
      "id": 11,
      "date": "2026-01-05",
      "task": "Add .gitignore and translate README",
      "implementation": "Created .gitignore file excluding node_modules, build files, debug files (DOM.html), IDE files, and OS files. Translated README.md from Hebrew to English."
    },
    {
      "id": 12,
      "date": "2026-01-05",
      "task": "Remove break duration feature",
      "implementation": "Removed break duration field from popup UI, settings storage, and README documentation as it's not needed for the Clock In/Out automation."
    },
    {
      "id": 13,
      "date": "2026-01-05",
      "task": "Update default date range",
      "implementation": "Changed Start Date to always show first day of current month and End Date to today on each popup open. Dates are calculated fresh each time, not persisted to storage."
    },
    {
      "id": 14,
      "date": "2026-01-05",
      "task": "Add remember dates option",
      "implementation": "Added 'Remember last dates' checkbox. When unchecked (default), dates reset to first of month and today. When checked, last used dates are persisted and restored on next popup open."
    },
    {
      "id": 15,
      "date": "2026-01-05",
      "task": "Add local installation guide",
      "implementation": "Created INSTALL.md with step-by-step instructions for loading the extension locally in Chrome, including troubleshooting tips."
    }
  ]
}
```
