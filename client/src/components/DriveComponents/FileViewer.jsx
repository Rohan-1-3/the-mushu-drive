import React, { useState, useEffect, useCallback } from 'react';
import { fileApi } from '../../lib/api';

const FileViewer = ({ file, isOpen, onClose }) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDownload = async () => {
        if (!file?.id) return;
        
        try {
            const response = await fileApi.downloadFile(file.id);
            
            // Create a blob URL for the downloaded data
            const blob = new Blob([response], { type: file.fileType || 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            
            // Create a temporary anchor element to trigger download
            const link = document.createElement('a');
            link.href = url;
            link.download = file.name; // Suggest filename for download
            
            // Append to body, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up the blob URL
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to download file:', err);
            // Fallback to opening in new window if download fails
            if (previewUrl) {
                window.open(previewUrl, '_blank');
            }
        }
    };

    const loadPreviewUrl = useCallback(async () => {
        if (!file?.id) return;
        
        setLoading(true);
        setError(null);
        try {
            const response = await fileApi.getPreviewUrl(file.id);
            setPreviewUrl(response.downloadUrl);
        } catch (err) {
            console.error('Failed to load preview URL:', err);
            setError('Failed to load file preview');
        } finally {
            setLoading(false);
        }
    }, [file?.id]);

    useEffect(() => {
        if (isOpen && file) {
            loadPreviewUrl();
        }
        return () => {
            setPreviewUrl(null);
            setError(null);
        };
    }, [isOpen, file, loadPreviewUrl]);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (isOpen && e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyPress);
            return () => document.removeEventListener('keydown', handleKeyPress);
        }
    }, [isOpen, onClose]);

    const getFileTypeCategory = (mimetype) => {
        if (!mimetype) return 'unknown';
        
        if (mimetype.startsWith('image/')) return 'image';
        if (mimetype.startsWith('video/')) return 'video';
        if (mimetype.startsWith('audio/')) return 'audio';
        if (mimetype.includes('pdf')) return 'pdf';
        if (mimetype.startsWith('text/') || 
            mimetype.includes('json') || 
            mimetype.includes('javascript') ||
            mimetype.includes('css') ||
            mimetype.includes('html')) return 'text';
        if (mimetype.includes('word') || 
            mimetype.includes('document') ||
            mimetype.includes('excel') ||
            mimetype.includes('spreadsheet') ||
            mimetype.includes('powerpoint') ||
            mimetype.includes('presentation')) return 'office';
        
        return 'unknown';
    };

    const renderFileContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h3 className="text-lg font-medium text-text-light dark:text-text-dark mb-2">
                        Preview Not Available
                    </h3>
                    <p className="text-text-light/60 dark:text-text-dark/60 mb-4">
                        {error}
                    </p>
                    <button
                        onClick={loadPreviewUrl}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        if (!previewUrl) return null;

        const fileType = getFileTypeCategory(file.fileType);

        switch (fileType) {
            case 'image':
                return (
                    <div className="flex justify-center items-center h-full">
                        <img
                            src={previewUrl}
                            alt={file.name}
                            className="max-w-full max-h-full object-contain rounded-lg"
                            onError={() => setError('Failed to load image')}
                        />
                    </div>
                );

            case 'video':
                return (
                    <div className="flex justify-center items-center h-full">
                        <video
                            src={previewUrl}
                            controls
                            className="max-w-full max-h-full rounded-lg"
                            onError={() => setError('Failed to load video')}
                        >
                            Your browser does not support video playback.
                        </video>
                    </div>
                );

            case 'audio':
                return (
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="text-6xl mb-8">🎵</div>
                        <audio
                            src={previewUrl}
                            controls
                            className="w-full max-w-md"
                            onError={() => setError('Failed to load audio')}
                        >
                            Your browser does not support audio playback.
                        </audio>
                        <p className="text-text-light/70 dark:text-text-dark/70 mt-4 text-center">
                            {file.name}
                        </p>
                    </div>
                );

            case 'pdf':
                return (
                    <div className="h-full">
                        <iframe
                            src={`${previewUrl}#toolbar=0`}
                            className="w-full h-full rounded-lg border"
                            title={file.name}
                            onError={() => setError('Failed to load PDF')}
                        />
                    </div>
                );

            case 'text':
                return (
                    <div className="h-full">
                        <iframe
                            src={previewUrl}
                            className="w-full h-full rounded-lg border bg-white"
                            title={file.name}
                            onError={() => setError('Failed to load text file')}
                        />
                    </div>
                );

            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="text-6xl mb-4">📄</div>
                        <h3 className="text-lg font-medium text-text-light dark:text-text-dark mb-2">
                            Preview Not Available
                        </h3>
                        <p className="text-text-light/60 dark:text-text-dark/60 mb-4">
                            This file type cannot be previewed in the browser.
                        </p>
                        <button
                            onClick={() => window.open(previewUrl, '_blank')}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                        >
                            Download File
                        </button>
                    </div>
                );
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={(e) => {
                // Close if clicking on the backdrop (not the modal content)
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            {/* Modal */}
            <div className="bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-xl shadow-2xl w-full max-w-7xl h-[80vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/20 dark:border-white/10 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">{file.icon}</span>
                        <div>
                            <h2 className="text-lg font-semibold text-text-light dark:text-text-dark truncate">
                                {file.name}
                            </h2>
                            <p className="text-sm text-text-light/60 dark:text-text-dark/60">
                                {file.size} • {file.fileType}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDownload}
                            disabled={!previewUrl}
                            className="p-2 hover:bg-white/20 dark:hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                            title="Download"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                            </svg>
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 dark:hover:bg-white/10 rounded-lg transition-colors"
                            title="Close"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 overflow-auto">
                    {renderFileContent()}
                </div>
            </div>
        </div>
    );
};

export default FileViewer;
