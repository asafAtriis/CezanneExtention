// Cezanne HR Time Auto-Filler - Content Script
(function() {
  'use strict';

  const CONFIG = {
    waitTimeout: 15000,
    pollInterval: 200,
    actionDelay: 800
  };

  let isRunning = false;
  let shouldStop = false;

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'START_AUTOFILL') {
      if (isRunning) {
        sendResponse({ success: false, error: 'Auto-fill already in progress' });
        return true;
      }
      handleAutoFill(message.payload)
        .then(result => sendResponse(result))
        .catch(err => sendResponse({ success: false, error: err.message }));
      return true;
    }
    if (message.action === 'STOP_AUTOFILL') {
      shouldStop = true;
      sendResponse({ success: true, message: 'Stop requested' });
      return true;
    }
  });

  async function handleAutoFill(settings) {
    isRunning = true;
    shouldStop = false;
    log('Starting auto-fill', settings);

    try {
      const dates = generateDateRange(settings.startDate, settings.endDate, settings.skipWeekends, settings.weekendType);
      log(`Processing ${dates.length} days: ${JSON.stringify(dates)}`);

      let processed = 0;
      let failed = 0;

      for (let i = 0; i < dates.length; i++) {
        const date = dates[i];
        log(`Starting day ${i + 1}/${dates.length}: ${date}`);

        if (shouldStop) {
          log('Stopped by user');
          break;
        }

        try {
          await processDay(date, settings);
          processed++;
          log(`Completed ${date} (${processed}/${dates.length})`);
        } catch (err) {
          failed++;
          log(`Failed ${date}: ${err.message}`, 'error');
          if (failed >= 3) {
            throw new Error(`Too many failures (${failed}). Stopping.`);
          }
        }

        log(`Finished iteration ${i + 1}, moving to next...`);
        await delay(CONFIG.actionDelay);
      }

      log(`Loop finished. Processed: ${processed}, Failed: ${failed}`);

      return {
        success: true,
        message: `Completed: ${processed} days processed, ${failed} failed`
      };
    } finally {
      isRunning = false;
      log('Auto-fill finished');
    }
  }

  async function processDay(dateStr, settings) {
    log(`Processing day: ${dateStr}`);

    // Step 1: Click "Add New" button
    const addNewBtn = await findAddNewButton();
    if (!addNewBtn) {
      throw new Error('Could not find "Add New" button');
    }

    addNewBtn.click();
    log('Clicked Add New button');
    await delay(CONFIG.actionDelay);

    // Step 2: Wait for form to appear
    await waitForForm();
    log('Form appeared');
    await delay(300);

    // Step 3: Fill Clock In Date
    const clockInDateInput = await findDateInput('Clock In');
    if (clockInDateInput) {
      await setDateValue(clockInDateInput, dateStr);
      log('Set Clock In Date');
    }
    await delay(200);

    // Step 4: Fill Clock In Time
    const clockInTimeInput = await findTimeInput('Clock In');
    if (clockInTimeInput) {
      await setTimeValue(clockInTimeInput, settings.startTime);
      log('Set Clock In Time');
    }
    await delay(200);

    // Step 5: Fill Clock Out Date (same day)
    const clockOutDateInput = await findDateInput('Clock Out');
    if (clockOutDateInput) {
      await setDateValue(clockOutDateInput, dateStr);
      log('Set Clock Out Date');
    }
    await delay(200);

    // Step 6: Fill Clock Out Time
    const clockOutTimeInput = await findTimeInput('Clock Out');
    if (clockOutTimeInput) {
      await setTimeValue(clockOutTimeInput, settings.endTime);
      log('Set Clock Out Time');
    }
    await delay(200);

    // Step 7: Click Save
    const saveBtn = await findSaveButton();
    if (!saveBtn) {
      throw new Error('Could not find Save button');
    }

    saveBtn.click();
    log('Clicked Save button');

    // Step 8: Wait for save to complete
    await waitForSaveComplete();
    log('Save completed');
  }

  function findAddNewButton() {
    // Find button with text "Add New" in footer
    const buttons = document.querySelectorAll('button.cz-primary-button, button.cz-footer-bar-button');
    for (const btn of buttons) {
      const text = btn.textContent?.trim();
      if (text === 'Add New' || text === 'Add') {
        return btn;
      }
    }
    return null;
  }

  async function waitForForm() {
    // Wait for the Clock In section to appear with empty inputs (new form)
    const startTime = Date.now();
    while (Date.now() - startTime < CONFIG.waitTimeout) {
      const section = findSectionByTitle('Clock In');
      const saveBtn = findSaveButton();

      // Form is ready when Clock In section exists AND Save button is visible
      if (section && saveBtn && saveBtn.offsetParent) {
        // Check that date input is empty or accessible
        const dateInput = section.querySelector('input.mat-datepicker-input');
        if (dateInput) {
          return section;
        }
      }
      await delay(CONFIG.pollInterval);
    }
    throw new Error('Form did not appear');
  }

  function findSectionByTitle(title) {
    const sections = document.querySelectorAll('.cz-form-section-title');
    for (const section of sections) {
      if (section.textContent?.trim().includes(title)) {
        // Return the parent form section container
        return section.closest('cz-form-section, .cz-form-section-headered');
      }
    }
    return null;
  }

  async function findDateInput(sectionTitle) {
    const section = findSectionByTitle(sectionTitle);
    if (!section) {
      log(`Section "${sectionTitle}" not found`, 'error');
      return null;
    }

    // Find the date input within this section
    const dateInput = section.querySelector('input.mat-datepicker-input');
    return dateInput;
  }

  async function findTimeInput(sectionTitle) {
    const section = findSectionByTitle(sectionTitle);
    if (!section) {
      log(`Section "${sectionTitle}" not found`, 'error');
      return null;
    }

    // Find the time input within kendo-timepicker
    const timeInput = section.querySelector('kendo-timepicker input.k-input-inner');
    return timeInput;
  }

  function findSaveButton() {
    // Find Save button (primary button with text "Save")
    const buttons = document.querySelectorAll('button.cz-primary-button');
    for (const btn of buttons) {
      const text = btn.textContent?.trim();
      if (text === 'Save') {
        return btn;
      }
    }
    return null;
  }

  async function setDateValue(input, dateStr) {
    // Format: dateStr is "YYYY-MM-DD", need to convert to DD/MM/YYYY for Cezanne
    const [year, month, day] = dateStr.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    input.focus();
    await delay(50);

    // Clear existing value
    input.select();

    // Set value using native setter
    const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
    if (nativeSetter) {
      nativeSetter.call(input, formattedDate);
    } else {
      input.value = formattedDate;
    }

    // Dispatch events
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.dispatchEvent(new Event('blur', { bubbles: true }));

    await delay(100);
  }

  async function setTimeValue(input, timeStr) {
    // timeStr format from popup: "HH:mm", need to convert to "HH:mm:ss"
    const formattedTime = timeStr.includes(':') && timeStr.split(':').length === 2
      ? `${timeStr}:00`
      : timeStr;

    input.focus();
    await delay(50);

    // Clear field completely - select all and delete
    input.select();
    document.execCommand('selectAll', false, null);
    await delay(50);

    // Type each character to simulate real user input
    for (const char of formattedTime) {
      input.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keypress', { key: char, bubbles: true }));

      // Insert character using execCommand
      document.execCommand('insertText', false, char);

      input.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));
      await delay(20);
    }

    // Final events
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.dispatchEvent(new Event('blur', { bubbles: true }));

    await delay(100);
  }

  async function waitForSaveComplete() {
    // Wait for save to process
    await delay(1000);

    // Click outside to dismiss any overlay/modal
    await clickOutsideToClose();

    // Check if we're back to the list view (Save button gone, Add New button visible)
    const startTime = Date.now();
    while (Date.now() - startTime < CONFIG.waitTimeout) {
      const saveBtn = findSaveButton();
      const addNewBtn = findAddNewButton();

      // Form is closed when Save button is gone and Add New is available
      if ((!saveBtn || !saveBtn.offsetParent) && addNewBtn && addNewBtn.offsetParent) {
        await delay(500); // Extra wait for UI to stabilize
        return;
      }

      // Try clicking outside again if still stuck
      await clickOutsideToClose();
      await delay(CONFIG.pollInterval);
    }

    // If we're still here, try to find and click a back button
    const backBtn = document.querySelector('button[title="Back"], .cz-back-button, [class*="back"]');
    if (backBtn) {
      backBtn.click();
      await delay(1000);
    }
  }

  async function clickOutsideToClose() {
    // Try clicking on overlay/backdrop elements
    const overlaySelectors = [
      '.cz-view-stack-overlay',
      '.cdk-overlay-backdrop',
      '.modal-backdrop',
      '.overlay',
      '[class*="overlay"]',
      '[class*="backdrop"]'
    ];

    for (const selector of overlaySelectors) {
      const overlay = document.querySelector(selector);
      if (overlay && overlay.offsetParent !== null) {
        overlay.click();
        log('Clicked overlay to close');
        await delay(300);
        return;
      }
    }

    // Fallback: click on main content area
    const mainContent = document.querySelector('.cz-shell-inner-container, main, .cz-data-entry-ctl-container');
    if (mainContent) {
      mainContent.click();
      log('Clicked main content to close');
      await delay(300);
    }
  }

  function generateDateRange(startStr, endStr, skipWeekends, weekendType = 'israel') {
    const dates = [];

    // Weekend days: Israel = Friday(5) + Saturday(6), International = Saturday(6) + Sunday(0)
    const weekendDays = weekendType === 'israel' ? [5, 6] : [0, 6];

    // Parse dates and iterate by incrementing day
    let [year, month, day] = startStr.split('-').map(Number);
    const [endYear, endMonth, endDay] = endStr.split('-').map(Number);
    const endDate = new Date(endYear, endMonth - 1, endDay);

    while (true) {
      const current = new Date(year, month - 1, day);

      // Stop after end date
      if (current > endDate) break;

      const dayOfWeek = current.getDay();
      const isWeekend = weekendDays.includes(dayOfWeek);

      if (!skipWeekends || !isWeekend) {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dates.push(dateStr);
      }

      // Move to next day
      day++;
      if (day > new Date(year, month, 0).getDate()) {
        day = 1;
        month++;
        if (month > 12) {
          month = 1;
          year++;
        }
      }
    }

    log(`Generated ${dates.length} dates from ${startStr} to ${endStr} (inclusive, weekend: ${weekendType})`);
    return dates;
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function log(message, level = 'info') {
    const prefix = '[CezanneAutoFill]';
    if (level === 'error') {
      console.error(prefix, message);
    } else {
      console.log(prefix, message);
    }
  }

  log('Content script loaded');
})();
