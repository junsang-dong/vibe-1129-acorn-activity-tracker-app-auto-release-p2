/**
 * Acorn Activity Tracker
 * Main Application Module
 */

// ===== Storage Manager =====
class Storage {
  static KEYS = {
    HABITS: 'acorn_habits',
    LOGS: 'acorn_logs',
    SETTINGS: 'acorn_settings'
  };

  static get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('Storage get error:', err);
      return null;
    }
  }

  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error('Storage set error:', err);
      return false;
    }
  }

  static remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.error('Storage remove error:', err);
      return false;
    }
  }

  static clear() {
    try {
      localStorage.clear();
      return true;
    } catch (err) {
      console.error('Storage clear error:', err);
      return false;
    }
  }
}

// ===== Habit Manager =====
class HabitManager {
  constructor() {
    this.habits = this.loadHabits();
    this.logs = this.loadLogs();
  }

  loadHabits() {
    return Storage.get(Storage.KEYS.HABITS) || [];
  }

  loadLogs() {
    return Storage.get(Storage.KEYS.LOGS) || {};
  }

  saveHabits() {
    Storage.set(Storage.KEYS.HABITS, this.habits);
  }

  saveLogs() {
    Storage.set(Storage.KEYS.LOGS, this.logs);
  }

  createHabit(data) {
    const habit = {
      id: this.generateId(),
      name: data.name,
      description: data.description || '',
      color: data.color || '#4CAF50',
      icon: data.icon || '💪',
      frequency: {
        type: data.frequencyType || 'daily',
        count: parseInt(data.frequencyCount) || 1
      },
      createdAt: new Date().toISOString(),
      archived: false
    };

    this.habits.push(habit);
    this.logs[habit.id] = [];
    this.saveHabits();
    this.saveLogs();

    return habit;
  }

  updateHabit(id, data) {
    const index = this.habits.findIndex(h => h.id === id);
    if (index === -1) return null;

    this.habits[index] = {
      ...this.habits[index],
      ...data,
      id // Ensure ID doesn't change
    };

    this.saveHabits();
    return this.habits[index];
  }

  deleteHabit(id) {
    const index = this.habits.findIndex(h => h.id === id);
    if (index === -1) return false;

    this.habits.splice(index, 1);
    delete this.logs[id];
    this.saveHabits();
    this.saveLogs();

    return true;
  }

  archiveHabit(id) {
    return this.updateHabit(id, { archived: true });
  }

  unarchiveHabit(id) {
    return this.updateHabit(id, { archived: false });
  }

  getHabit(id) {
    return this.habits.find(h => h.id === id);
  }

  getActiveHabits() {
    return this.habits.filter(h => !h.archived);
  }

  getArchivedHabits() {
    return this.habits.filter(h => h.archived);
  }

  logCompletion(habitId, date = null) {
    const dateStr = date || this.getToday();
    
    if (!this.logs[habitId]) {
      this.logs[habitId] = [];
    }

    if (!this.logs[habitId].includes(dateStr)) {
      this.logs[habitId].push(dateStr);
      this.logs[habitId].sort();
      this.saveLogs();
    }
  }

  removeCompletion(habitId, date = null) {
    const dateStr = date || this.getToday();
    
    if (!this.logs[habitId]) return;

    const index = this.logs[habitId].indexOf(dateStr);
    if (index > -1) {
      this.logs[habitId].splice(index, 1);
      this.saveLogs();
    }
  }

  isCompletedToday(habitId) {
    const today = this.getToday();
    return this.logs[habitId]?.includes(today) || false;
  }

  getStreak(habitId) {
    if (!this.logs[habitId] || this.logs[habitId].length === 0) {
      return 0;
    }

    const logs = [...this.logs[habitId]].sort().reverse();
    const today = this.getToday();
    let streak = 0;
    let currentDate = new Date(today);

    for (const logDate of logs) {
      const log = new Date(logDate);
      const diffDays = Math.floor((currentDate - log) / (1000 * 60 * 60 * 24));

      if (diffDays === streak) {
        streak++;
      } else {
        break;
      }

      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  }

  getToday() {
    return new Date().toISOString().split('T')[0];
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  exportData() {
    return {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      habits: this.habits,
      logs: this.logs
    };
  }

  importData(data) {
    try {
      if (!data.habits || !data.logs) {
        throw new Error('Invalid data format');
      }

      this.habits = data.habits;
      this.logs = data.logs;
      this.saveHabits();
      this.saveLogs();

      return true;
    } catch (err) {
      console.error('Import error:', err);
      return false;
    }
  }
}

// ===== UI Manager =====
class UIManager {
  constructor(habitManager) {
    this.habitManager = habitManager;
    this.currentEditingId = null;
    this.initElements();
    this.initEventListeners();
    this.initTheme();
  }

  initElements() {
    this.elements = {
      habitsGrid: document.getElementById('habits-grid'),
      archivedGrid: document.getElementById('archived-grid'),
      archivedSection: document.getElementById('archived-section'),
      emptyState: document.getElementById('empty-state'),
      btnAddHabit: document.getElementById('btn-add-habit'),
      btnTheme: document.getElementById('btn-theme'),
      btnSettings: document.getElementById('btn-settings'),
      modalHabit: document.getElementById('modal-habit'),
      modalSettings: document.getElementById('modal-settings'),
      formHabit: document.getElementById('form-habit'),
      toast: document.getElementById('toast'),
      toastMessage: document.getElementById('toast-message')
    };
  }

  initEventListeners() {
    // Add habit buttons
    this.elements.btnAddHabit?.addEventListener('click', () => this.openHabitModal());
    document.querySelectorAll('[data-add-habit]').forEach(btn => {
      btn.addEventListener('click', () => this.openHabitModal());
    });

    // Theme toggle
    this.elements.btnTheme?.addEventListener('click', () => this.toggleTheme());

    // Settings
    this.elements.btnSettings?.addEventListener('click', () => this.openModal('modal-settings'));

    // Modal close
    document.querySelectorAll('[data-modal-close]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) this.closeModal(modal.id);
      });
    });

    // Form submit
    this.elements.formHabit?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleHabitFormSubmit(e);
    });

    // Export/Import
    document.getElementById('btn-export')?.addEventListener('click', () => this.exportData());
    document.getElementById('btn-import')?.addEventListener('click', () => {
      document.getElementById('file-import')?.click();
    });
    document.getElementById('file-import')?.addEventListener('change', (e) => this.importData(e));
  }

  initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeIcon(savedTheme);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    this.updateThemeIcon(newTheme);
  }

  updateThemeIcon(theme) {
    if (this.elements.btnTheme) {
      this.elements.btnTheme.textContent = theme === 'light' ? '🌙' : '☀️';
    }
  }

  render() {
    this.renderActiveHabits();
    this.renderArchivedHabits();
  }

  renderActiveHabits() {
    const habits = this.habitManager.getActiveHabits();
    
    if (habits.length === 0) {
      this.elements.emptyState.style.display = 'block';
      const existingCards = this.elements.habitsGrid.querySelectorAll('.habit-card');
      existingCards.forEach(card => card.remove());
      return;
    }

    this.elements.emptyState.style.display = 'none';
    this.elements.habitsGrid.innerHTML = '';
    
    habits.forEach(habit => {
      const card = this.createHabitCard(habit);
      this.elements.habitsGrid.appendChild(card);
    });
  }

  renderArchivedHabits() {
    const habits = this.habitManager.getArchivedHabits();
    
    if (habits.length === 0) {
      this.elements.archivedSection.style.display = 'none';
      return;
    }

    this.elements.archivedSection.style.display = 'block';
    this.elements.archivedGrid.innerHTML = '';
    
    habits.forEach(habit => {
      const card = this.createHabitCard(habit, true);
      this.elements.archivedGrid.appendChild(card);
    });
  }

  createHabitCard(habit, isArchived = false) {
    const card = document.createElement('div');
    card.className = 'habit-card';
    card.style.borderLeftColor = habit.color;

    const isCompleted = this.habitManager.isCompletedToday(habit.id);
    const streak = this.habitManager.getStreak(habit.id);

    card.innerHTML = `
      <div class="habit-header">
        <span class="habit-icon">${habit.icon}</span>
        <div class="habit-actions">
          ${!isArchived ? `
            <button class="btn-icon" data-action="toggle" data-id="${habit.id}" title="완료 토글">
              ${isCompleted ? '✓' : '○'}
            </button>
          ` : ''}
          <button class="btn-icon" data-action="edit" data-id="${habit.id}" title="수정">
            ✏️
          </button>
          <button class="btn-icon" data-action="${isArchived ? 'unarchive' : 'archive'}" data-id="${habit.id}" title="${isArchived ? '복원' : '보관'}">
            ${isArchived ? '↩️' : '📦'}
          </button>
          <button class="btn-icon" data-action="delete" data-id="${habit.id}" title="삭제">
            🗑️
          </button>
        </div>
      </div>
      <h3 class="habit-title">${this.escapeHtml(habit.name)}</h3>
      ${habit.description ? `<p class="habit-description">${this.escapeHtml(habit.description)}</p>` : ''}
      <div class="habit-stats">
        <div class="habit-streak">
          <strong>${streak}</strong> 일 연속
        </div>
        <div class="habit-frequency">
          ${habit.frequency.type === 'daily' ? '매일' : `주 ${habit.frequency.count}회`}
        </div>
      </div>
    `;

    // Event listeners
    card.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        this.handleHabitAction(action, id);
      });
    });

    return card;
  }

  handleHabitAction(action, id) {
    switch (action) {
      case 'toggle':
        this.toggleCompletion(id);
        break;
      case 'edit':
        this.openHabitModal(id);
        break;
      case 'archive':
        this.archiveHabit(id);
        break;
      case 'unarchive':
        this.unarchiveHabit(id);
        break;
      case 'delete':
        this.deleteHabit(id);
        break;
    }
  }

  toggleCompletion(id) {
    if (this.habitManager.isCompletedToday(id)) {
      this.habitManager.removeCompletion(id);
      this.showToast('완료 취소됨');
    } else {
      this.habitManager.logCompletion(id);
      this.showToast('완료! 🎉');
    }
    this.render();
  }

  archiveHabit(id) {
    this.habitManager.archiveHabit(id);
    this.showToast('습관이 보관되었습니다');
    this.render();
  }

  unarchiveHabit(id) {
    this.habitManager.unarchiveHabit(id);
    this.showToast('습관이 복원되었습니다');
    this.render();
  }

  deleteHabit(id) {
    if (confirm('이 습관을 삭제하시겠습니까? 모든 기록이 삭제됩니다.')) {
      this.habitManager.deleteHabit(id);
      this.showToast('습관이 삭제되었습니다');
      this.render();
    }
  }

  openHabitModal(id = null) {
    this.currentEditingId = id;
    const habit = id ? this.habitManager.getHabit(id) : null;

    const title = document.getElementById('modal-habit-title');
    const form = this.elements.formHabit;

    if (habit) {
      title.textContent = '습관 수정';
      form.elements.name.value = habit.name;
      form.elements.description.value = habit.description || '';
      form.elements.color.value = habit.color;
      form.elements.icon.value = habit.icon;
      form.elements.frequencyType.value = habit.frequency.type;
      form.elements.frequencyCount.value = habit.frequency.count;
    } else {
      title.textContent = '새 습관 추가';
      form.reset();
    }

    this.openModal('modal-habit');
  }

  handleHabitFormSubmit(e) {
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (this.currentEditingId) {
      this.habitManager.updateHabit(this.currentEditingId, data);
      this.showToast('습관이 수정되었습니다');
    } else {
      this.habitManager.createHabit(data);
      this.showToast('새 습관이 추가되었습니다');
    }

    this.closeModal('modal-habit');
    this.render();
  }

  openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  showToast(message, duration = 3000) {
    this.elements.toastMessage.textContent = message;
    this.elements.toast.classList.add('show');

    setTimeout(() => {
      this.elements.toast.classList.remove('show');
    }, duration);
  }

  exportData() {
    const data = this.habitManager.exportData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `acorn-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    this.showToast('데이터가 내보내기되었습니다');
  }

  importData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (this.habitManager.importData(data)) {
          this.showToast('데이터를 가져왔습니다');
          this.render();
        } else {
          this.showToast('데이터 가져오기 실패');
        }
      } catch (err) {
        this.showToast('잘못된 파일 형식입니다');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// ===== Initialize Application =====
document.addEventListener('DOMContentLoaded', () => {
  const habitManager = new HabitManager();
  const uiManager = new UIManager(habitManager);
  
  // Initial render
  uiManager.render();

  // Set version in settings
  const versionEl = document.getElementById('app-version');
  if (versionEl) {
    const version = document.querySelector('meta[name="version"]')?.content || '1.0.0';
    versionEl.textContent = version;
  }

  console.log('🌰 Acorn Activity Tracker initialized');
});

