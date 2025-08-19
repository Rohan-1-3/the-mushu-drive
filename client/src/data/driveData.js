// Mock data for Google Drive-like interface
export const mockFolders = [
    {
        id: 'folder-1',
        name: 'Documents',
        type: 'folder',
        icon: '📁',
        size: null,
        dateModified: '2025-08-18',
        shared: false,
        color: '#4285F4'
    },
    {
        id: 'folder-2',
        name: 'Images',
        type: 'folder',
        icon: '🖼️',
        size: null,
        dateModified: '2025-08-17',
        shared: true,
        color: '#34A853'
    },
    {
        id: 'folder-3',
        name: 'Projects',
        type: 'folder',
        icon: '💼',
        size: null,
        dateModified: '2025-08-15',
        shared: false,
        color: '#FBBC04'
    },
    {
        id: 'folder-4',
        name: 'Music',
        type: 'folder',
        icon: '🎵',
        size: null,
        dateModified: '2025-08-10',
        shared: false,
        color: '#EA4335'
    }
];

export const mockFiles = [
    {
        id: 'file-1',
        name: 'Presentation.pptx',
        type: 'file',
        icon: '📊',
        size: '2.5 MB',
        dateModified: '2025-08-19',
        shared: false,
        fileType: 'presentation'
    },
    {
        id: 'file-2',
        name: 'Resume.pdf',
        type: 'file',
        icon: '📄',
        size: '856 KB',
        dateModified: '2025-08-18',
        shared: true,
        fileType: 'pdf'
    },
    {
        id: 'file-3',
        name: 'Budget.xlsx',
        type: 'file',
        icon: '📈',
        size: '1.2 MB',
        dateModified: '2025-08-16',
        shared: false,
        fileType: 'spreadsheet'
    },
    {
        id: 'file-4',
        name: 'Notes.txt',
        type: 'file',
        icon: '📝',
        size: '45 KB',
        dateModified: '2025-08-15',
        shared: false,
        fileType: 'text'
    },
    {
        id: 'file-5',
        name: 'Profile.jpg',
        type: 'file',
        icon: '🖼️',
        size: '3.8 MB',
        dateModified: '2025-08-14',
        shared: true,
        fileType: 'image'
    },
    {
        id: 'file-6',
        name: 'Video_Tutorial.mp4',
        type: 'file',
        icon: '🎥',
        size: '125 MB',
        dateModified: '2025-08-12',
        shared: false,
        fileType: 'video'
    }
];

export const breadcrumbData = [
    { id: 'root', name: 'My Drive', path: '/' },
    { id: 'folder-1', name: 'Documents', path: '/documents' },
    { id: 'subfolder-1', name: 'Work', path: '/documents/work' }
];

// Folder contents simulation
export const folderContents = {
    'folder-1': {
        folders: [
            {
                id: 'subfolder-1',
                name: 'Work Reports',
                type: 'folder',
                icon: '📋',
                size: null,
                dateModified: '2025-08-18',
                shared: false,
                color: '#9C27B0'
            },
            {
                id: 'subfolder-2',
                name: 'Personal',
                type: 'folder',
                icon: '👤',
                size: null,
                dateModified: '2025-08-16',
                shared: false,
                color: '#FF9800'
            }
        ],
        files: [
            {
                id: 'doc-1',
                name: 'Meeting_Notes.docx',
                type: 'file',
                icon: '📝',
                size: '245 KB',
                dateModified: '2025-08-18',
                shared: true,
                fileType: 'document'
            },
            {
                id: 'doc-2',
                name: 'Contract.pdf',
                type: 'file',
                icon: '📄',
                size: '1.1 MB',
                dateModified: '2025-08-17',
                shared: false,
                fileType: 'pdf'
            }
        ]
    },
    'folder-2': {
        folders: [],
        files: [
            {
                id: 'img-1',
                name: 'Vacation_Photo.jpg',
                type: 'file',
                icon: '🖼️',
                size: '4.2 MB',
                dateModified: '2025-08-17',
                shared: true,
                fileType: 'image'
            },
            {
                id: 'img-2',
                name: 'Screenshot.png',
                type: 'file',
                icon: '🖼️',
                size: '892 KB',
                dateModified: '2025-08-15',
                shared: false,
                fileType: 'image'
            }
        ]
    }
};

export const viewModes = {
    GRID: 'grid',
    LIST: 'list'
};
