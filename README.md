# Cezanne HR Time Auto-Filler

Browser extension for automatic timesheet entry in Cezanne HR system.

## Description

This extension automates time entry in Cezanne HR. Instead of manually filling each day, the extension iterates through the selected date range and fills in the hours automatically.

### Features

- Date range selection (start date to end date)
- Daily start and end time configuration
- Automatic weekend skipping (Israel or International weekends)
- Persistent settings storage
- Error handling with automatic stop after 3 failures

## Project Structure

```
CezanneExtention/
├── manifest.json          # Extension configuration (Manifest V3)
├── README.md              # This file
├── CHANGELOG.md           # Change log
├── popup/
│   ├── popup.html         # User interface
│   ├── popup.css          # Styling
│   └── popup.js           # Form logic and messaging
├── content/
│   └── content.js         # Automation engine (DOM manipulation)
└── icons/                 # Icons
```

## Development Installation

### Prerequisites

- Chrome browser (version 88+) or Edge
- Access to Cezanne HR system

### Installation Steps

1. **Open Extension Manager**
   ```
   Chrome: chrome://extensions
   Edge: edge://extensions
   ```

2. **Enable Developer Mode**
   - Toggle "Developer mode" in the top right corner

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the project folder: `C:\Projects\CezanneExtention`

4. **Verify Installation**
   - The extension should appear in the list as "Cezanne HR Time Auto-Filler"
   - The extension icon will appear in the toolbar

### Updating During Development

After code changes:

1. Go to `chrome://extensions`
2. Click the refresh button (circular arrow) on the extension card
3. Refresh the Cezanne HR page if open

### Viewing Logs

1. Open the Cezanne HR page
2. Press `F12` to open Developer Tools
3. Go to the "Console" tab
4. Filter by `[CezanneAutoFill]` to see extension messages

## Usage

1. **Navigate to the Timesheet Page**
   - Log in to Cezanne HR
   - Navigate to the Clock In / Out page

2. **Open the Extension**
   - Click the extension icon in the toolbar

3. **Configure Parameters**
   - **Start Date**: First date to fill (default: first day of current month)
   - **End Date**: Last date to fill (default: today)
   - **Daily Start Time**: Clock in time (default: 09:00)
   - **Daily End Time**: Clock out time (default: 17:00)
   - **Remember last dates**: When checked, saves and restores your last used dates
   - **Skip Weekends**: Skip weekend days (checked by default)
   - **Weekend Days**: Israel (Fri-Sat) or International (Sat-Sun)

4. **Run**
   - Click "Start Auto-Fill"
   - Wait for the process to complete

## Production Deployment

### Creating a ZIP for Publishing

1. **Prepare Files**
   ```bash
   # Ensure no unnecessary files exist
   # Delete .git, node_modules, etc. if present
   ```

2. **Create ZIP**
   ```bash
   # Windows PowerShell
   Compress-Archive -Path * -DestinationPath ../cezanne-autofill.zip
   ```

### Publishing to Chrome Web Store

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Pay the one-time registration fee ($5)
3. Click "New Item" and upload the ZIP file
4. Fill in extension details (description, screenshots, category)
5. Submit for review

### Private Installation (Enterprise)

For internal distribution without Chrome Web Store:

1. **Pack the Extension**
   - In `chrome://extensions` click "Pack extension"
   - Select the project folder
   - Files will be created: `.crx` (extension) and `.pem` (private key)

2. **Install via Group Policy**
   - Upload the CRX file to an internal server
   - Configure the download URL in Group Policy

## Customizing DOM Selectors

If the extension doesn't correctly identify page elements, update the selectors in `content/content.js`:

```javascript
// Key selectors used:
// - Add New button: button.cz-primary-button with text "Add New"
// - Clock In/Out sections: .cz-form-section-title containing "Clock In" / "Clock Out"
// - Date input: input.mat-datepicker-input
// - Time input: kendo-timepicker input.k-input-inner
// - Save button: button.cz-primary-button with text "Save"
```

### Finding the Correct Selectors

1. Open the Cezanne HR page
2. Press `F12` → "Elements" tab
3. Use the selection tool (arrow in the top left) and click on the desired element
4. Copy the element's class or id
5. Update the selectors in the code accordingly

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Extension doesn't load | Ensure all files exist and no errors in manifest.json |
| "Please navigate to Cezanne HR first" | Navigate to cezannehr.com or cezanneondemand.com |
| "Failed to communicate with page" | Refresh the page and try again |
| "Could not find Add New button" | Check if the button text/class has changed |
| "Form did not appear" | Increase timeouts in CONFIG or check selectors |
| "Could not find Save button" | Verify the Save button selector |

## License

Internal project - for personal use only.

## Support

For bug reports or feature requests, contact the developer.
