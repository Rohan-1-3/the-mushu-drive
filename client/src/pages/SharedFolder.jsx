import React, { useCallback, useEffect, useState } from 'react';
import Navbar from '../components/LandingPageComponents/NavBar';
import DriveGrid from '../components/DriveComponents/DriveGrid';
import { useNavigate, useParams, useRouteLoaderData } from 'react-router';
import { formatFileSize, getFileIcon } from '../lib/fileAndFolderHelper';
import { sharedFileAndFolderApi } from '../lib/api';
import FileViewer from '../components/DriveComponents/FileViewer';
import DriveToolbar from '../components/DriveComponents/DriveToolbar';

function SharedFolder() {
    const { folderId } = useParams();
    const [loading, setLoading] = useState(false);
    const [currentFolderId, setCurrentFolderId] = useState(folderId || null);
    const [currentItems, setCurrentItems] = useState([]);
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [fileViewerState, setFileViewerState] = useState({ isOpen: false, file: null });

    const navigate = useNavigate();

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

            // Load specific folder contents
            const response = await sharedFileAndFolderApi.getSharedFolder(folderId);

            const folders = response.folder.subfolders.map(transformFolderData);
            const files = response.folder.files.map(transformFileData);

            setCurrentItems([...folders, ...files]);

        } catch (error) {
            console.error('Failed to load folder contents:', error);
            setCurrentItems([]);
        } finally {
            setLoading(false);
        }
    }, [transformFolderData, transformFileData]);

    useEffect(() => {
        const folderIdFromUrl = folderId || null;
        setCurrentFolderId(folderIdFromUrl);
    }, [folderId]);

    useEffect(() => {
        loadFolderContents(currentFolderId);
    }, [currentFolderId]);

    const handleItemDoubleClick = (item) => {
        if (item.type === 'folder') {
            // Navigate into folder using URL
            navigate(`/shared/folder/${item.id}`);
        } else {
            // Open file in viewer
            setFileViewerState({ isOpen: true, file: item });
        }
    };

    const handleItemRightClick = (e) => {
        e.preventDefault();
    };

    const loaderData = useRouteLoaderData("shared");

    return (
        <div className="space-y-4 p-4">
            <Navbar isAuthenticated={loaderData}/>
            <DriveToolbar
                viewMode={viewMode}
                setViewMode={setViewMode}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                fromShare = {true}
            />
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
            <FileViewer
                file={fileViewerState.file}
                isOpen={fileViewerState.isOpen}
                onClose={() => setFileViewerState({ isOpen: false, file: null })}
                fromShare={true}
            />
        </div>
    );
}

export default SharedFolder;