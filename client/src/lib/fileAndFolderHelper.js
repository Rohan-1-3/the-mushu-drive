// Helper function to get file type icon
export const getFileIcon = (mimetype) => {
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
export const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const unitSeconds = {
    hour: 3600,
    day: 86400,
    week: 604800,
    month: 2592000,
    year: 31536000
};