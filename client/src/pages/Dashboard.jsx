import React, { useState, useEffect } from 'react';
import DriveToolbar from '../components/DriveComponents/DriveToolbar';
import Breadcrumb from '../components/DriveComponents/Breadcrumb';
import DriveGrid from '../components/DriveComponents/DriveGrid';
import ContextMenu from '../components/DriveComponents/ContextMenu';
import CreateFolderModal from '../components/DriveComponents/CreateFolderModal';
import { mockFolders, mockFiles, folderContents } from '../data/driveData';

export default function Dashboard() {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPath, setCurrentPath] = useState('/');
  const [currentItems, setCurrentItems] = useState([]);
  const [contextMenu, setContextMenu] = useState({ isVisible: false, position: { x: 0, y: 0 }, item: null });
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);

  // Load items based on current path
  useEffect(() => {
    if (currentPath === '/') {
      setCurrentItems([...mockFolders, ...mockFiles]);
    } else {
      // In a real app, you'd make an API call here
      const folderData = folderContents[getFolderIdFromPath(currentPath)];
      if (folderData) {
        setCurrentItems([...folderData.folders, ...folderData.files]);
      } else {
        setCurrentItems([]);
      }
    }
  }, [currentPath]);

  const getFolderIdFromPath = (path) => {
    // Simple mapping for demo - in real app, you'd have proper path resolution
    const pathMap = {
      '/documents': 'folder-1',
      '/images': 'folder-2',
      '/projects': 'folder-3',
      '/music': 'folder-4'
    };
    return pathMap[path] || null;
  };

  const handleItemDoubleClick = (item) => {
    if (item.type === 'folder') {
      // Navigate into folder
      const newPath = currentPath === '/' ? `/${item.name.toLowerCase()}` : `${currentPath}/${item.name.toLowerCase()}`;
      setCurrentPath(newPath);
    } else {
      // Open file (simulated)
      alert(`Opening ${item.name}...`);
    }
  };

  const handleItemRightClick = (e, item) => {
    e.preventDefault();
    setContextMenu({
      isVisible: true,
      position: { x: e.clientX, y: e.clientY },
      item
    });
  };

  const handleContextMenuAction = (action, item) => {
    switch (action) {
      case 'open':
        handleItemDoubleClick(item);
        break;
      case 'download':
        alert(`Downloading ${item.name}...`);
        break;
      case 'share':
        alert(`Sharing ${item.name}...`);
        break;
      case 'rename': {
        const newName = prompt(`Rename ${item.name} to:`, item.name);
        if (newName && newName !== item.name) {
          alert(`Renamed ${item.name} to ${newName}`);
        }
        break;
      }
      case 'delete':
        if (confirm(`Are you sure you want to delete ${item.name}?`)) {
          alert(`Deleted ${item.name}`);
        }
        break;
      default:
        alert(`Action: ${action} on ${item.name}`);
    }
  };

  const handleCreateFolder = (folderName) => {
    // In a real app, you'd make an API call here
    alert(`Created folder: ${folderName}`);
    // Refresh current items
    setCurrentItems(prev => [...prev, {
      id: `folder-${Date.now()}`,
      name: folderName,
      type: 'folder',
      icon: '📁',
      size: null,
      dateModified: new Date().toISOString().split('T')[0],
      shared: false,
      color: '#4285F4'
    }]);
  };

  const handleUploadFile = () => {
    // In a real app, you'd open a file picker
    alert('Upload file dialog would open here...');
  };

  const handleNavigate = (path) => {
    setCurrentPath(path);
  };

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">My Drive</h1>
        <p className="text-text-light/70 dark:text-text-dark/70">
          Organize and access your files from anywhere
        </p>
      </div>

      {/* Breadcrumb Navigation */}
      <Breadcrumb currentPath={currentPath} onNavigate={handleNavigate} />

      {/* Toolbar */}
      <DriveToolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onCreateFolder={() => setIsCreateFolderModalOpen(true)}
        onUploadFile={handleUploadFile}
      />

      {/* Drive Grid */}
      <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-xl border border-white/20 dark:border-white/10 p-6">
        <DriveGrid
          items={currentItems}
          viewMode={viewMode}
          onItemDoubleClick={handleItemDoubleClick}
          onItemRightClick={handleItemRightClick}
          searchTerm={searchTerm}
        />
      </div>

      {/* Context Menu */}
      <ContextMenu
        isVisible={contextMenu.isVisible}
        position={contextMenu.position}
        item={contextMenu.item}
        onClose={() => setContextMenu({ isVisible: false, position: { x: 0, y: 0 }, item: null })}
        onAction={handleContextMenuAction}
      />

      {/* Create Folder Modal */}
      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
        onCreateFolder={handleCreateFolder}
      />
    </div>
  );
}
