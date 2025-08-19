import React, { useState, useEffect, useCallback } from 'react';
import DriveToolbar from '../components/DriveComponents/DriveToolbar';
import Breadcrumb from '../components/DriveComponents/Breadcrumb';
import DriveGrid from '../components/DriveComponents/DriveGrid';
import ContextMenu from '../components/DriveComponents/ContextMenu';
import CreateFolderModal from '../components/DriveComponents/CreateFolderModal';
import { fileApi, folderApi } from '../lib/api';

export default function Dashboard() {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFolderId, setCurrentFolderId] = useState(undefined); // undefined means root
  const [currentItems, setCurrentItems] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: 'My Drive', path: '/' }]);
  const [contextMenu, setContextMenu] = useState({ isVisible: false, position: { x: 0, y: 0 }, item: null });
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Helper function to get file type icon
  const getFileIcon = (mimetype) => {
    if (!mimetype) return '📄';
    
    if (mimetype.startsWith('image/')) return '🖼️';
    if (mimetype.startsWith('video/')) return '🎥';
    if (mimetype.startsWith('audio/')) return '🎵';
    if (mimetype.includes('pdf')) return '📄';
    if (mimetype.includes('word') || mimetype.includes('document')) return '📝';
    if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) return '📈';
    if (mimetype.includes('powerpoint') || mimetype.includes('presentation')) return '📊';
    if (mimetype.includes('text/')) return '📝';
    if (mimetype.includes('zip') || mimetype.includes('archive')) return '🗜️';
    
    return '📄';
  };

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Transform backend data to frontend format
  const transformFolderData = useCallback((folder) => ({
    id: folder.id,
    name: folder.name,
    type: 'folder',
    icon: '📁',
    size: null,
    dateModified: folder.updatedAt || folder.createdAt,
    shared: false,
    color: '#4285F4',
    itemCount: (folder._count?.files || 0) + (folder._count?.subfolders || 0)
  }), []);

  const transformFileData = useCallback((file) => ({
    id: file.id,
    name: file.name,
    type: 'file',
    icon: getFileIcon(file.mimetype),
    size: formatFileSize(file.size),
    dateModified: file.updatedAt || file.createdAt,
    shared: false,
    fileType: file.mimetype,
    url: file.url
  }), []);

  // Load items based on current folder
  const loadFolderContents = useCallback(async (folderId = null) => {
    setLoading(true);
    try {
      if (folderId === null) {
        // Load root folder contents
        const [foldersResponse, filesResponse] = await Promise.all([
          folderApi.getAllFolders(null),
          fileApi.getAllFiles()
        ]);

        const rootFolders = foldersResponse.folders.map(transformFolderData);
        const rootFiles = filesResponse.filter(file => !file.folderId).map(transformFileData);
        
        setCurrentItems([...rootFolders, ...rootFiles]);
      } else {
        // Load specific folder contents
        const response = await folderApi.getFolderContents(folderId);
        
        const folders = response.subfolders.map(transformFolderData);
        const files = response.files.map(transformFileData);
        
        setCurrentItems([...folders, ...files]);
      }
    } catch (error) {
      console.error('Failed to load folder contents:', error);
      setCurrentItems([]);
    } finally {
      setLoading(false);
    }
  }, [transformFolderData, transformFileData]);

  // Load initial data
  useEffect(() => {
    loadFolderContents(currentFolderId);
  }, [currentFolderId, loadFolderContents]);

  const handleItemDoubleClick = (item) => {
    if (item.type === 'folder') {
      // Navigate into folder
      setCurrentFolderId(item.id);
      
      // Update breadcrumbs
      setBreadcrumbs(prev => [...prev, { 
        id: item.id, 
        name: item.name, 
        path: `${prev[prev.length - 1].path}${item.name}/` 
      }]);
    } else {
      // Open/download file
      if (item.url) {
        window.open(item.url, '_blank');
      }
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

  const handleContextMenuAction = async (action, item) => {
    try {
      switch (action) {
        case 'open':
          handleItemDoubleClick(item);
          break;
          
        case 'download':
          if (item.type === 'file') {
            const response = await fileApi.getDownloadUrl(item.id);
            window.open(response.downloadUrl, '_blank');
          }
          break;
          
        case 'share':
          alert(`Sharing functionality for ${item.name} coming soon...`);
          break;
          
        case 'rename': {
          const newName = prompt(`Rename ${item.name} to:`, item.name);
          if (newName && newName !== item.name) {
            if (item.type === 'folder') {
              await folderApi.renameFolder(item.id, newName);
            } else {
              await fileApi.renameFile(item.id, newName);
            }
            // Reload current folder
            loadFolderContents(currentFolderId);
          }
          break;
        }
        
        case 'delete':
          if (confirm(`Are you sure you want to delete ${item.name}?`)) {
            if (item.type === 'folder') {
              await folderApi.deleteFolder(item.id, false);
            } else {
              await fileApi.deleteFile(item.id);
            }
            // Reload current folder
            loadFolderContents(currentFolderId);
          }
          break;
          
        default:
          alert(`Action: ${action} on ${item.name}`);
      }
    } catch (error) {
      console.error(`Failed to ${action} ${item.name}:`, error);
      alert(`Failed to ${action} ${item.name}. Please try again.`);
    }
  };

  const handleCreateFolder = async (folderName) => {
    try {
      console.log("Creating folder:", folderName, currentFolderId);
      await folderApi.createFolder(folderName, currentFolderId);
      // Reload current folder to show new folder
      loadFolderContents(currentFolderId);
    } catch (error) {
      console.error('Failed to create folder:', error);
      alert('Failed to create folder. Please try again.');
    }
  };

  const handleUploadFile = () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '*/*';
    
    input.onchange = async (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      try {
        setLoading(true);
        
        for (const file of files) {
          const formData = new FormData();
          formData.append('file', file);
          if (currentFolderId) {
            formData.append('folderId', currentFolderId);
          }
          
          await fileApi.uploadSingleFile(formData);
        }
        
        // Reload current folder to show uploaded files
        loadFolderContents(currentFolderId);
      } catch (error) {
        console.error('Failed to upload files:', error);
        alert('Failed to upload files. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    input.click();
  };

  const handleNavigate = (breadcrumbIndex) => {
    const targetBreadcrumb = breadcrumbs[breadcrumbIndex];
    setCurrentFolderId(targetBreadcrumb.id);
    setBreadcrumbs(breadcrumbs.slice(0, breadcrumbIndex + 1));
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
      <Breadcrumb
        currentPath={breadcrumbs.map(b => b.name).join('/')}
        onNavigate={handleNavigate}
      />

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
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <DriveGrid
            items={currentItems}
            viewMode={viewMode}
            onItemDoubleClick={handleItemDoubleClick}
            onItemRightClick={handleItemRightClick}
            searchTerm={searchTerm}
          />
        )}
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
