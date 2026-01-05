document.addEventListener('DOMContentLoaded', init);

async function init() {
  await loadSettings();
  document.getElementById('startBtn').addEventListener('click', handleStart);
  document.getElementById('skipWeekends').addEventListener('change', toggleWeekendType);
  toggleWeekendType();
}

function toggleWeekendType() {
  const skipWeekends = document.getElementById('skipWeekends').checked;
  const weekendTypeGroup = document.getElementById('weekendTypeGroup');
  weekendTypeGroup.style.display = skipWeekends ? 'block' : 'none';
}

async function loadSettings() {
  const defaults = {
    startDate: getFirstDayOfMonth(),
    endDate: getTodayString(),
    startTime: '09:00',
    endTime: '17:00',
    rememberDates: false,
    skipWeekends: true,
    weekendType: 'israel'
  };

  try {
    const stored = await chrome.storage.local.get(defaults);

    // Use stored dates only if rememberDates is enabled, otherwise use defaults
    if (stored.rememberDates && stored.startDate && stored.endDate) {
      document.getElementById('startDate').value = stored.startDate;
      document.getElementById('endDate').value = stored.endDate;
    } else {
      document.getElementById('startDate').value = getFirstDayOfMonth();
      document.getElementById('endDate').value = getTodayString();
    }

    document.getElementById('startTime').value = stored.startTime;
    document.getElementById('endTime').value = stored.endTime;
    document.getElementById('rememberDates').checked = stored.rememberDates;
    document.getElementById('skipWeekends').checked = stored.skipWeekends;
    document.getElementById('weekendType').value = stored.weekendType;
  } catch (err) {
    console.error('Failed to load settings:', err);
  }
}

async function saveSettings(settings) {
  try {
    await chrome.storage.local.set(settings);
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

function getFormValues() {
  return {
    startDate: document.getElementById('startDate').value,
    endDate: document.getElementById('endDate').value,
    startTime: document.getElementById('startTime').value,
    endTime: document.getElementById('endTime').value,
    rememberDates: document.getElementById('rememberDates').checked,
    skipWeekends: document.getElementById('skipWeekends').checked,
    weekendType: document.getElementById('weekendType').value
  };
}

function validateForm(values) {
  if (!values.startDate || !values.endDate) {
    return 'Please select start and end dates';
  }
  if (new Date(values.startDate) > new Date(values.endDate)) {
    return 'Start date must be before end date';
  }
  if (!values.startTime || !values.endTime) {
    return 'Please set start and end times';
  }
  if (values.startTime >= values.endTime) {
    return 'Start time must be before end time';
  }
  return null;
}

async function handleStart() {
  const values = getFormValues();
  const error = validateForm(values);

  if (error) {
    showStatus(error, 'error');
    return;
  }

  await saveSettings(values);
  showStatus('Starting auto-fill...', 'info');

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.url || (!tab.url.includes('cezannehr.com') && !tab.url.includes('cezanneondemand.com'))) {
      showStatus('Please navigate to Cezanne HR first', 'error');
      return;
    }

    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'START_AUTOFILL',
      payload: values
    });

    if (response && response.success) {
      showStatus(response.message || 'Auto-fill started!', 'success');
    } else {
      showStatus(response?.error || 'Failed to start auto-fill', 'error');
    }
  } catch (err) {
    console.error('Error:', err);
    showStatus('Failed to communicate with page. Try refreshing.', 'error');
  }
}

function showStatus(message, type) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = 'status ' + type;
}

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

function getFirstDayOfMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
}
