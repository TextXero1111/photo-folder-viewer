// Photo Gallery Manager
class PhotoGallery {
  constructor() {
    this.folders = this.loadFolders();
    this.photos = this.loadPhotos();
    this.currentPath = ['Home'];
    this.currentPhotos = [];
    this.currentPhotoIndex = 0;
    
    this.init();
  }

  // Initialize the application
  init() {
    this.setupEventListeners();
    this.render();
  }

  // Load folders from localStorage or create default structure
  loadFolders() {
    const saved = localStorage.getItem('gallery-folders');
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Default folder structure
    return {
      'Home': ['Travel', 'Family', 'Nature', 'Events', 'Memories'],
      'Travel': ['Europe', 'Asia'],
      'Family': [],
      'Nature': ['Landscapes', 'Wildlife'],
      'Events': [],
      'Memories': [],
      'Europe': [],
      'Asia': [],
      'Landscapes': [],
      'Wildlife': []
    };
  }

  // Load photos from localStorage
  loadPhotos() {
    const saved = localStorage.getItem('gallery-photos');
    return saved ? JSON.parse(saved) : {};
  }

  // Save folders to localStorage
  saveFolders() {
    localStorage.setItem('gallery-folders', JSON.stringify(this.folders));
  }

  // Save photos to localStorage
  savePhotos() {
    localStorage.setItem('gallery-photos', JSON.stringify(this.photos));
  }

  // Get current folder name
  getCurrentFolder() {
    return this.currentPath[this.currentPath.length - 1];
  }

  // Setup event listeners
  setupEventListeners() {
    // Drag and drop
    const dropZone = document.getElementById('drop-zone');
    
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      this.handleFiles(e.dataTransfer.files);
    });

    dropZone.addEventListener('click', () => {
      document.getElementById('upload').click();
    });

    // Keyboard navigation for photo modal and other modals
    document.addEventListener('keydown', (e) => {
      const photoModal = document.getElementById('photo-modal');
      const createFolderModal = document.getElementById('create-folder-modal');
      const renameFolderModal = document.getElementById('rename-folder-modal');

      // Photo modal navigation
      if (photoModal.classList.contains('show')) {
        switch(e.key) {
          case 'ArrowLeft':
            this.prevPhoto();
            break;
          case 'ArrowRight':
            this.nextPhoto();
            break;
          case 'Escape':
            this.closePhotoModal();
            break;
        }
      }

      // Create folder modal
      if (createFolderModal.classList.contains('show')) {
        switch(e.key) {
          case 'Enter':
            this.createFolder();
            break;
          case 'Escape':
            closeCreateFolderModal();
            break;
        }
      }

      // Rename folder modal
      if (renameFolderModal.classList.contains('show')) {
        switch(e.key) {
          case 'Enter':
            this.renameFolder();
            break;
          case 'Escape':
            closeRenameFolderModal();
            break;
        }
      }
    });
  }

  // Render the current view
  render() {
    this.updateBreadcrumb();
    this.updateBackButton();
    this.renderContent();
  }

  // Update breadcrumb navigation
  updateBreadcrumb() {
    const breadcrumb = document.getElementById('breadcrumb');
    breadcrumb.innerHTML = '';

    this.currentPath.forEach((folder, index) => {
      if (index > 0) {
        breadcrumb.innerHTML += '<span class="breadcrumb-separator"><i class="fas fa-chevron-right"></i></span>';
      }

      const isActive = index === this.currentPath.length - 1;
      const icon = index === 0 ? '<i class="fas fa-home"></i>' : '<i class="fas fa-folder"></i>';
      
      breadcrumb.innerHTML += `
        <span class="breadcrumb-item ${isActive ? 'active' : ''}" onclick="gallery.navigateToPath(${index})">
          ${icon} ${folder}
        </span>
      `;
    });
  }

  // Update back button state
  updateBackButton() {
    const backBtn = document.getElementById('back-btn');
    backBtn.disabled = this.currentPath.length <= 1;
  }

  // Render content grid
  renderContent() {
    const grid = document.getElementById('content-grid');
    const emptyState = document.getElementById('empty-state');
    const currentFolder = this.getCurrentFolder();
    
    grid.innerHTML = '';
    
    const folders = this.folders[currentFolder] || [];
    const photos = this.photos[currentFolder] || [];
    
    // Render folders
    folders.forEach(folderName => {
      const folderElement = this.createFolderElement(folderName);
      grid.appendChild(folderElement);
    });

    // Render photos
    photos.forEach((photo, index) => {
      const photoElement = this.createPhotoElement(photo, index);
      grid.appendChild(photoElement);
    });

    // Show empty state if no content
    if (folders.length === 0 && photos.length === 0) {
      emptyState.style.display = 'block';
      grid.style.display = 'none';
    } else {
      emptyState.style.display = 'none';
      grid.style.display = 'grid';
    }
  }

  // Create folder element
  createFolderElement(folderName) {
    const div = document.createElement('div');
    div.className = 'folder-item';
    div.innerHTML = `
      <div class="item-image">
        <i class="fas fa-folder folder-icon"></i>
      </div>
      <div class="item-info">
        <div class="item-title">${folderName}</div>
        <div class="item-subtitle">${this.getFolderItemCount(folderName)} items</div>
      </div>
      <div class="item-actions">
        <button class="action-btn" onclick="gallery.showRenameFolderModal('${folderName}')" title="Rename folder">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn" onclick="gallery.deleteFolder('${folderName}')" title="Delete folder">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;

    div.addEventListener('click', (e) => {
      if (!e.target.closest('.item-actions')) {
        this.openFolder(folderName);
      }
    });

    return div;
  }

  // Create photo element
  createPhotoElement(photoData, index) {
    const div = document.createElement('div');
    div.className = 'photo-item';
    div.innerHTML = `
      <div class="item-image">
        <img src="${photoData.src}" alt="${photoData.name}" loading="lazy">
      </div>
      <div class="item-info">
        <div class="item-title">${photoData.name}</div>
        <div class="item-subtitle">${this.formatFileSize(photoData.size || 0)}</div>
      </div>
      <div class="item-actions">
        <button class="action-btn" onclick="gallery.deletePhoto(${index})" title="Delete photo">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    
    div.addEventListener('click', (e) => {
      if (!e.target.closest('.item-actions')) {
        this.openPhotoModal(index);
      }
    });

    return div;
  }

  // Get folder item count
  getFolderItemCount(folderName) {
    const subfolders = this.folders[folderName] || [];
    const photos = this.photos[folderName] || [];
    return subfolders.length + photos.length;
  }

  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Navigate to specific path index
  navigateToPath(index) {
    this.currentPath = this.currentPath.slice(0, index + 1);
    this.render();
  }

  // Open folder
  openFolder(folderName) {
    this.currentPath.push(folderName);
    this.render();
  }

  // Go back
  goBack() {
    if (this.currentPath.length > 1) {
      this.currentPath.pop();
      this.render();
    }
  }

  // Handle file uploads
  handleFiles(files) {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        this.uploadPhoto(file);
      }
    });
  }

  // Upload single photo
  uploadPhoto(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const currentFolder = this.getCurrentFolder();
      if (!this.photos[currentFolder]) {
        this.photos[currentFolder] = [];
      }
      
      const photoData = {
        src: e.target.result,
        name: file.name,
        size: file.size,
        uploadDate: new Date().toISOString()
      };
      
      this.photos[currentFolder].push(photoData);
      this.savePhotos();
      this.render();
    };
    reader.readAsDataURL(file);
  }

  // Upload multiple photos
  uploadPhotos(event) {
    this.handleFiles(event.target.files);
    event.target.value = ''; // Reset input
  }

  // Create new folder
  createFolder() {
    const input = document.getElementById('folder-name-input');
    const folderName = input.value.trim();

    if (!folderName) {
      alert('Please enter a folder name');
      return;
    }

    const currentFolder = this.getCurrentFolder();
    if (!this.folders[currentFolder]) {
      this.folders[currentFolder] = [];
    }

    if (this.folders[currentFolder].includes(folderName)) {
      alert('A folder with this name already exists');
      return;
    }

    this.folders[currentFolder].push(folderName);
    this.folders[folderName] = []; // Initialize empty folder
    this.saveFolders();
    this.render();
    this.closeCreateFolderModal();
  }

  // Show rename folder modal
  showRenameFolderModal(folderName) {
    this.folderToRename = folderName;
    document.getElementById('rename-folder-input').value = folderName;
    document.getElementById('rename-folder-modal').classList.add('show');
    document.getElementById('rename-folder-input').focus();
    document.getElementById('rename-folder-input').select();
  }

  // Rename folder
  renameFolder() {
    const input = document.getElementById('rename-folder-input');
    const newFolderName = input.value.trim();
    const oldFolderName = this.folderToRename;

    if (!newFolderName) {
      alert('Please enter a folder name');
      return;
    }

    if (newFolderName === oldFolderName) {
      this.closeRenameFolderModal();
      return;
    }

    const currentFolder = this.getCurrentFolder();

    // Check if new name already exists in current folder
    if (this.folders[currentFolder] && this.folders[currentFolder].includes(newFolderName)) {
      alert('A folder with this name already exists');
      return;
    }

    // Update folder structure
    this.renameFolderRecursive(oldFolderName, newFolderName);

    // Update current path if we're inside the renamed folder
    this.updatePathAfterRename(oldFolderName, newFolderName);

    this.saveFolders();
    this.savePhotos();
    this.render();
    this.closeRenameFolderModal();
  }

  // Recursively rename folder and update all references
  renameFolderRecursive(oldName, newName) {
    // Update in all parent folders
    Object.keys(this.folders).forEach(parentFolder => {
      const index = this.folders[parentFolder].indexOf(oldName);
      if (index > -1) {
        this.folders[parentFolder][index] = newName;
      }
    });

    // Move folder contents to new name
    if (this.folders[oldName]) {
      this.folders[newName] = this.folders[oldName];
      delete this.folders[oldName];
    }

    // Move photos to new folder name
    if (this.photos[oldName]) {
      this.photos[newName] = this.photos[oldName];
      delete this.photos[oldName];
    }
  }

  // Update current path after rename
  updatePathAfterRename(oldName, newName) {
    for (let i = 0; i < this.currentPath.length; i++) {
      if (this.currentPath[i] === oldName) {
        this.currentPath[i] = newName;
      }
    }
  }

  // Delete folder
  deleteFolder(folderName) {
    if (confirm(`Are you sure you want to delete the folder "${folderName}" and all its contents?`)) {
      const currentFolder = this.getCurrentFolder();

      // Remove from parent folder
      const index = this.folders[currentFolder].indexOf(folderName);
      if (index > -1) {
        this.folders[currentFolder].splice(index, 1);
      }

      // Remove folder and its contents recursively
      this.deleteFolderRecursive(folderName);

      this.saveFolders();
      this.savePhotos();
      this.render();
    }
  }

  // Recursively delete folder and contents
  deleteFolderRecursive(folderName) {
    // Delete subfolders
    if (this.folders[folderName]) {
      this.folders[folderName].forEach(subfolder => {
        this.deleteFolderRecursive(subfolder);
      });
      delete this.folders[folderName];
    }

    // Delete photos
    if (this.photos[folderName]) {
      delete this.photos[folderName];
    }
  }

  // Delete photo
  deletePhoto(index) {
    if (confirm('Are you sure you want to delete this photo?')) {
      const currentFolder = this.getCurrentFolder();
      this.photos[currentFolder].splice(index, 1);
      this.savePhotos();
      this.render();
    }
  }

  // Open photo modal
  openPhotoModal(index) {
    const currentFolder = this.getCurrentFolder();
    this.currentPhotos = this.photos[currentFolder] || [];
    this.currentPhotoIndex = index;

    this.updatePhotoModal();
    this.setupTouchNavigation();
    this.setupModalClickHandler();
    document.getElementById('photo-modal').classList.add('show');
  }

  // Setup modal click handler to close on outside click
  setupModalClickHandler() {
    const modal = document.getElementById('photo-modal');
    const modalContent = modal.querySelector('.modal-content');

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closePhotoModal();
      }
    });
  }

  // Setup touch navigation for mobile devices
  setupTouchNavigation() {
    const modalImg = document.getElementById('modal-img');
    let startX = 0;
    let startY = 0;

    modalImg.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    modalImg.addEventListener('touchend', (e) => {
      if (!startX || !startY) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;

      const diffX = startX - endX;
      const diffY = startY - endY;

      // Only trigger if horizontal swipe is more significant than vertical
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // Swipe left - next photo
          this.nextPhoto();
        } else {
          // Swipe right - previous photo
          this.prevPhoto();
        }
      }

      startX = 0;
      startY = 0;
    }, { passive: true });
  }

  // Close photo modal
  closePhotoModal() {
    document.getElementById('photo-modal').classList.remove('show');
  }

  // Update photo modal content
  updatePhotoModal() {
    if (this.currentPhotos.length === 0) return;

    const photo = this.currentPhotos[this.currentPhotoIndex];
    const modalImg = document.getElementById('modal-img');
    const photoTitle = document.getElementById('photo-title');
    const photoCounter = document.getElementById('photo-counter');
    const leftNav = document.querySelector('.modal-nav-left');
    const rightNav = document.querySelector('.modal-nav-right');
    const swipeIndicator = document.getElementById('swipe-indicator');

    // Update image and info
    modalImg.src = photo.src;
    modalImg.alt = photo.name;
    photoTitle.textContent = photo.name;
    photoCounter.textContent = `${this.currentPhotoIndex + 1} / ${this.currentPhotos.length}`;

    // Show/hide navigation elements based on photo count
    if (this.currentPhotos.length <= 1) {
      leftNav.classList.add('single-photo');
      rightNav.classList.add('single-photo');
      if (swipeIndicator) swipeIndicator.style.display = 'none';
    } else {
      leftNav.classList.remove('single-photo');
      rightNav.classList.remove('single-photo');
      if (swipeIndicator) {
        swipeIndicator.style.display = 'block';
        swipeIndicator.textContent = `Swipe or use ← → keys (${this.currentPhotoIndex + 1}/${this.currentPhotos.length})`;
      }
    }

    // Update navigation button states for better UX
    leftNav.style.opacity = this.currentPhotos.length > 1 ? '1' : '0.3';
    rightNav.style.opacity = this.currentPhotos.length > 1 ? '1' : '0.3';

    // Add loading state
    modalImg.style.opacity = '0.5';
    modalImg.onload = () => {
      modalImg.style.opacity = '1';
    };
  }

  // Previous photo
  prevPhoto() {
    if (this.currentPhotos.length <= 1) return;

    // Add smooth transition effect
    const modalImg = document.getElementById('modal-img');
    modalImg.style.transform = 'translateX(-20px)';
    modalImg.style.opacity = '0.7';

    setTimeout(() => {
      this.currentPhotoIndex = (this.currentPhotoIndex - 1 + this.currentPhotos.length) % this.currentPhotos.length;
      this.updatePhotoModal();

      // Reset transition
      modalImg.style.transform = 'translateX(0)';
      modalImg.style.opacity = '1';
    }, 150);
  }

  // Next photo
  nextPhoto() {
    if (this.currentPhotos.length <= 1) return;

    // Add smooth transition effect
    const modalImg = document.getElementById('modal-img');
    modalImg.style.transform = 'translateX(20px)';
    modalImg.style.opacity = '0.7';

    setTimeout(() => {
      this.currentPhotoIndex = (this.currentPhotoIndex + 1) % this.currentPhotos.length;
      this.updatePhotoModal();

      // Reset transition
      modalImg.style.transform = 'translateX(0)';
      modalImg.style.opacity = '1';
    }, 150);
  }

  // Delete current photo from modal
  deleteCurrentPhoto() {
    if (confirm('Are you sure you want to delete this photo?')) {
      const currentFolder = this.getCurrentFolder();
      this.photos[currentFolder].splice(this.currentPhotoIndex, 1);
      this.savePhotos();

      // Update modal or close if no more photos
      if (this.photos[currentFolder].length === 0) {
        this.closePhotoModal();
      } else {
        this.currentPhotos = this.photos[currentFolder];
        if (this.currentPhotoIndex >= this.currentPhotos.length) {
          this.currentPhotoIndex = this.currentPhotos.length - 1;
        }
        this.updatePhotoModal();
      }

      this.render();
    }
  }

  // Download current photo
  downloadCurrentPhoto() {
    const photo = this.currentPhotos[this.currentPhotoIndex];
    const link = document.createElement('a');
    link.href = photo.src;
    link.download = photo.name;
    link.click();
  }

  // Export all data
  exportData() {
    const data = {
      folders: this.folders,
      photos: this.photos,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `photo-gallery-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // Import data
  importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        if (data.folders && data.photos) {
          if (confirm('This will replace all current data. Are you sure?')) {
            this.folders = data.folders;
            this.photos = data.photos;
            this.saveFolders();
            this.savePhotos();
            this.currentPath = ['Home'];
            this.render();
            alert('Data imported successfully!');
          }
        } else {
          alert('Invalid backup file format');
        }
      } catch (error) {
        alert('Error reading backup file');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  // Clear all data
  clearAllData() {
    if (confirm('This will delete ALL folders and photos. This action cannot be undone. Are you sure?')) {
      if (confirm('Are you REALLY sure? This will permanently delete everything!')) {
        localStorage.removeItem('gallery-folders');
        localStorage.removeItem('gallery-photos');
        this.folders = this.loadFolders();
        this.photos = {};
        this.currentPath = ['Home'];
        this.render();
        alert('All data has been cleared');
      }
    }
  }
}

// Modal functions (called from HTML)
function showCreateFolderModal() {
  document.getElementById('create-folder-modal').classList.add('show');
  document.getElementById('folder-name-input').focus();
}

function closeCreateFolderModal() {
  document.getElementById('create-folder-modal').classList.remove('show');
  document.getElementById('folder-name-input').value = '';
}

function showRenameFolderModal(folderName) {
  gallery.showRenameFolderModal(folderName);
}

function closeRenameFolderModal() {
  document.getElementById('rename-folder-modal').classList.remove('show');
  document.getElementById('rename-folder-input').value = '';
}

function renameFolder() {
  gallery.renameFolder();
}

function showManageModal() {
  document.getElementById('manage-modal').classList.add('show');
}

function closeManageModal() {
  document.getElementById('manage-modal').classList.remove('show');
}

// Global functions (called from HTML)
function goBack() {
  gallery.goBack();
}

function uploadPhotos(event) {
  gallery.uploadPhotos(event);
}

function createFolder() {
  gallery.createFolder();
}

function closePhotoModal() {
  gallery.closePhotoModal();
}

function prevPhoto() {
  gallery.prevPhoto();
}

function nextPhoto() {
  gallery.nextPhoto();
}

function deleteCurrentPhoto() {
  gallery.deleteCurrentPhoto();
}

function downloadCurrentPhoto() {
  gallery.downloadCurrentPhoto();
}

function exportData() {
  gallery.exportData();
}

function importData(event) {
  gallery.importData(event);
}

function clearAllData() {
  gallery.clearAllData();
}

// Initialize the gallery when DOM is loaded
let gallery;
document.addEventListener('DOMContentLoaded', () => {
  gallery = new PhotoGallery();
});
