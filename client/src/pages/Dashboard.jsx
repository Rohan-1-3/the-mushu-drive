import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import DriveToolbar from '../components/DriveComponents/DriveToolbar';
import Breadcrumb from '../components/DriveComponents/Breadcrumb';
import DriveGrid from '../components/DriveComponents/DriveGrid';
import ContextMenu from '../components/DriveComponents/ContextMenu';
import CreateFolderModal from '../components/DriveComponents/CreateFolderModal';
import FileViewer from '../components/DriveComponents/FileViewer';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import RenameModal from '../components/ui/RenameModal';
import DeleteFolderModal from '../components/ui/DeleteFolderModal';
import { fileApi, folderApi } from '../lib/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const { folderId } = useParams();
  
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFolderId, setCurrentFolderId] = useState(folderId || null);
  const [currentItems, setCurrentItems] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: 'My Drive', url: '/drive' }]);
  const [contextMenu, setContextMenu] = useState({ isVisible: false, position: { x: 0, y: 0 }, item: null });
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [fileViewerState, setFileViewerState] = useState({ isOpen: false, file: null });
  const [loading, setLoading] = useState(false);

  // Modal states
  const [confirmationModal, setConfirmationModal] = useState({ 
    isOpen: false, 
    title: '', 
    message: '', 
    onConfirm: null,
    type: 'danger'
  });
  const [renameModal, setRenameModal] = useState({ 
    isOpen: false, 
    item: null, 
    currentName: ''
  });
  const [deleteFolderModal, setDeleteFolderModal] = useState({
    isOpen: false,
    folder: null
  });

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

  // Build breadcrumb trail by traversing folder hierarchy
  const buildBreadcrumbTrail = useCallback(async (folderId) => {
    if (folderId === null) {
      setBreadcrumbs([{ id: null, name: 'My Drive', url: '/drive' }]);
      return;
    }

    try {
      const folderResponse = await folderApi.getSingleFolder(folderId);
      const currentFolder = folderResponse;
      
      // Build the trail by following parent relationships
      const trail = [];
      let folder = currentFolder;
      
      // Traverse up the hierarchy
      while (folder) {
        trail.unshift({ 
          id: folder.id, 
          name: folder.name,
          url: `/drive/folder/${folder.id}`
        });
        
        if (folder.parentId) {
          const parentResponse = await folderApi.getSingleFolder(folder.parentId);
          folder = parentResponse;
        } else {
          folder = null;
        }
      }
      
      // Add root at the beginning
      setBreadcrumbs([{ id: null, name: 'My Drive', url: '/drive' }, ...trail]);
    } catch (error) {
      console.error('Failed to build breadcrumb trail:', error);
      setBreadcrumbs([{ id: null, name: 'My Drive', url: '/drive' }]);
    }
  }, []);

  // Update current folder when URL changes
  useEffect(() => {
    const folderIdFromUrl = folderId || null;
    setCurrentFolderId(folderIdFromUrl);
  }, [folderId]);

  // Load initial data and build breadcrumbs
  useEffect(() => {
    loadFolderContents(currentFolderId);
    buildBreadcrumbTrail(currentFolderId);
  }, [currentFolderId, loadFolderContents, buildBreadcrumbTrail]);

  const handleItemDoubleClick = (item) => {
    if (item.type === 'folder') {
      // Navigate into folder using URL
      navigate(`/drive/folder/${item.id}`);
    } else {
      // Open file in viewer
      setFileViewerState({ isOpen: true, file: item });
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

  // Modal helper functions
  const showConfirmation = (title, message, onConfirm, type = 'danger') => {
    setConfirmationModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      type
    });
  };

  const showToast = (message, type = 'info') => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast.warning(message);
        break;
      default:
        toast.info(message);
    }
  };

  const showRename = (item) => {
    setRenameModal({
      isOpen: true,
      item,
      currentName: item.name
    });
  };

  const showDeleteFolder = (folder) => {
    setDeleteFolderModal({
      isOpen: true,
      folder
    });
  };

  const handleRename = async (newName) => {
    try {
      const item = renameModal.item;
      if (item.type === 'folder') {
        await folderApi.renameFolder(item.id, newName);
      } else {
        await fileApi.renameFile(item.id, newName);
      }
      // Reload current folder
      loadFolderContents(currentFolderId);
      showToast(`${item.name} has been renamed to ${newName}.`, 'success');
    } catch (error) {
      console.error('Failed to rename item:', error);
      showToast('Failed to rename item. Please try again.', 'error');
    }
  };

  const handleDeleteFolder = async (force = false) => {
    try {
      const folder = deleteFolderModal.folder;
      await folderApi.deleteFolder(folder.id, force);
      // Reload current folder
      loadFolderContents(currentFolderId);
      showToast(
        `Folder "${folder.name}" has been deleted successfully.`,
        'success'
      );
    } catch (error) {
      console.error('Failed to delete folder:', error);
      showToast(
        'Failed to delete folder. Please try again.',
        'error'
      );
    }
  };

  const handleContextMenuAction = async (action, item) => {
    try {
      switch (action) {
        case 'open':
        case 'preview':
          handleItemDoubleClick(item);
          break;
          
        case 'download':
          if (item.type === 'file') {
            const response = await fileApi.getDownloadUrl(item.id);
            window.open(response.downloadUrl, '_blank');
          }
          break;
          
        case 'share':
          showToast(`Sharing functionality for ${item.name} will be available soon.`, 'info');
          break;
          
        case 'rename':
          showRename(item);
          break;
        
        case 'delete':
          if (item.type === 'folder') {
            showDeleteFolder(item);
          } else {
            showConfirmation(
              'Delete File',
              `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
              async () => {
                try {
                  await fileApi.deleteFile(item.id);
                  // Reload current folder
                  loadFolderContents(currentFolderId);
                  showToast(`${item.name} has been deleted successfully.`, 'success');
                } catch (error) {
                  console.error(`Failed to delete ${item.name}:`, error);
                  showToast(`Failed to delete ${item.name}. Please try again.`, 'error');
                }
              },
              'danger'
            );
          }
          break;
          
        default:
          showToast(`${action} action on ${item.name}`, 'info');
      }
    } catch (error) {
      console.error(`Failed to ${action} ${item.name}:`, error);
      showToast(`Failed to ${action} ${item.name}. Please try again.`, 'error');
    }
  };

  const handleCreateFolder = async (folderName) => {
    try {
      console.log("Creating folder:", folderName, currentFolderId);
      await folderApi.createFolder(folderName, currentFolderId);
      // Reload current folder to show new folder
      loadFolderContents(currentFolderId);
      showToast(`Folder "${folderName}" has been created successfully.`, 'success');
    } catch (error) {
      console.error('Failed to create folder:', error);
      showToast('Failed to create folder. Please try again.', 'error');
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
        showToast(`${files.length === 1 ? 'File' : files.length + ' files'} uploaded successfully.`, 'success');
      } catch (error) {
        console.error('Failed to upload files:', error);
        showToast('Failed to upload files. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    input.click();
  };

  const handleBreadcrumbNavigate = (breadcrumb) => {
    navigate(breadcrumb.url);
  };

  return (
    <div className="space-y-4 p-4">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        breadcrumbs={breadcrumbs}
        onNavigate={handleBreadcrumbNavigate}
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

      {/* File Viewer */}
      <FileViewer
        file={fileViewerState.file}
        isOpen={fileViewerState.isOpen}
        onClose={() => setFileViewerState({ isOpen: false, file: null })}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ ...confirmationModal, isOpen: false })}
        onConfirm={() => {
          confirmationModal.onConfirm?.();
          setConfirmationModal({ ...confirmationModal, isOpen: false });
        }}
        title={confirmationModal.title}
        message={confirmationModal.message}
        type={confirmationModal.type}
      />

      {/* Rename Modal */}
      <RenameModal
        isOpen={renameModal.isOpen}
        onClose={() => setRenameModal({ ...renameModal, isOpen: false })}
        onRename={handleRename}
        currentName={renameModal.currentName}
        title={`Rename ${renameModal.item?.type === 'folder' ? 'Folder' : 'File'}`}
      />

      {/* Delete Folder Modal */}
      <DeleteFolderModal
        isOpen={deleteFolderModal.isOpen}
        onClose={() => setDeleteFolderModal({ ...deleteFolderModal, isOpen: false })}
        onConfirm={handleDeleteFolder}
        folder={deleteFolderModal.folder}
      />
    </div>
  );
}
