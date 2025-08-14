# Photo Gallery Manager

A modern, responsive web application for organizing and managing your photo collection with a beautiful three-level folder structure.

## Features

### 📁 Three-Level Navigation
- **Page 1**: Main folders (Travel, Family, Nature, Events, Memories)
- **Page 2**: Subfolders or photos within selected folders
- **Page 3**: Photos within subfolders
- Intuitive breadcrumb navigation
- Back button functionality

### 📸 Photo Management
- **Upload**: Drag & drop or click to upload multiple photos
- **View**: Click photos to open in enhanced full-screen modal viewer
- **Navigate**: Large navigation buttons, keyboard arrows, and touch/swipe gestures
- **Smooth Transitions**: Professional fade effects between photos
- **Mobile Optimized**: Touch-friendly controls and swipe navigation
- **Delete**: Remove unwanted photos
- **Download**: Save photos to your device

### 🗂️ Folder Management
- **Create**: Add new folders at any level
- **Rename**: Dynamically rename any folder with automatic reference updates
- **Delete**: Remove folders and all contents
- **Navigate**: Seamless folder browsing
- **Organize**: Flexible folder structure

### 💾 Data Persistence
- **Local Storage**: All data saved in browser
- **Export**: Backup all photos and folder structure
- **Import**: Restore from backup files
- **Clear**: Reset all data when needed

### 📱 Responsive Design
- **Mobile-friendly**: Works on all devices
- **Modern UI**: Clean, intuitive interface
- **Smooth animations**: Enhanced user experience
- **Touch-friendly**: Optimized for mobile interaction

## Quick Start

1. **Open** `index.html` in your web browser
2. **Upload** photos by dragging and dropping or clicking the upload button
3. **Create** folders to organize your photos
4. **Navigate** through your collection using the folder structure
5. **View** photos in full-screen mode with navigation controls

## File Structure

```
photo-gallery/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Deployment Options

### Option 1: GitHub Pages (Recommended)

1. **Create a GitHub repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/photo-gallery.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

3. **Access your gallery**:
   - Your site will be available at: `https://yourusername.github.io/photo-gallery`

### Option 2: Netlify

1. **Drag and drop** your project folder to [Netlify Drop](https://app.netlify.com/drop)
2. **Get instant URL** for your gallery

### Option 3: Vercel

1. **Install Vercel CLI**: `npm i -g vercel`
2. **Deploy**: Run `vercel` in your project directory
3. **Follow prompts** to deploy

### Option 4: Local Server

For development or local use:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## Usage Tips

### Keyboard Shortcuts
**In photo viewer:**
- **←** Previous photo
- **→** Next photo
- **Esc** Close photo viewer
- **Swipe left/right** Navigate on mobile
- **Click outside** Close viewer

**In folder modals:**
- **Enter** Confirm action (create/rename)
- **Esc** Cancel and close modal

### Best Practices
- **Organize first**: Create your folder structure before uploading
- **Rename safely**: Folder renaming automatically updates all references and paths
- **Regular backups**: Use the export feature to backup your data
- **Image formats**: Supports JPG, PNG, GIF, WebP
- **File sizes**: Larger images may take longer to load

### Data Management
- **Export regularly**: Your data is stored locally in the browser
- **Clear browser data**: Will remove all photos and folders
- **Import/Export**: Use JSON format for data transfer

## Troubleshooting

### Photos not loading?
- Check if images are in supported formats (JPG, PNG, GIF, WebP)
- Ensure browser has sufficient storage space
- Try refreshing the page

### Lost data?
- Check if you have a backup file (exported JSON)
- Data is stored in browser's localStorage
- Clearing browser data will remove all content

### Performance issues?
- Large numbers of high-resolution photos may slow performance
- Consider organizing into more subfolders
- Use image compression tools before uploading

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup and file APIs
- **CSS3**: Modern styling with flexbox and grid
- **Vanilla JavaScript**: No external dependencies
- **LocalStorage API**: Client-side data persistence
- **FileReader API**: Image upload and processing
- **Font Awesome**: Icons

### Data Storage
- All data stored in browser's localStorage
- Photos stored as base64 encoded strings
- Folder structure stored as JSON object
- No server required - fully client-side

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Enjoy organizing your photos!** 📸✨
