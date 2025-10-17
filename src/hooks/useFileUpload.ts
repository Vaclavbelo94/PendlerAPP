import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FileSelectOptions {
  accept?: string;
  maxSize?: number; // in bytes
  maxFiles?: number;
  multiple?: boolean;
}

interface UploadOptions {
  bucket: string;
  path: string;
  onProgress?: (progress: number) => void;
}

interface SelectedFile {
  file: File;
  preview?: string;
  size: number;
  type: string;
  name: string;
}

export const useFileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Select single file
  const selectFile = useCallback(async (
    options: FileSelectOptions = {}
  ): Promise<SelectedFile | null> => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = options.accept || '*/*';

      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          resolve(null);
          return;
        }

        // Validate file size
        if (options.maxSize && file.size > options.maxSize) {
          setError(`File size exceeds ${(options.maxSize / 1024 / 1024).toFixed(2)}MB`);
          resolve(null);
          return;
        }

        // Create preview for images
        let preview: string | undefined;
        if (file.type.startsWith('image/')) {
          preview = URL.createObjectURL(file);
        }

        const selectedFile: SelectedFile = {
          file,
          preview,
          size: file.size,
          type: file.type,
          name: file.name
        };

        setSelectedFiles([selectedFile]);
        resolve(selectedFile);
      };

      input.click();
    });
  }, []);

  // Select multiple files
  const selectMultiple = useCallback(async (
    options: FileSelectOptions = {}
  ): Promise<SelectedFile[]> => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = options.accept || '*/*';
      input.multiple = true;

      input.onchange = async (e) => {
        const files = Array.from((e.target as HTMLInputElement).files || []);
        
        if (files.length === 0) {
          resolve([]);
          return;
        }

        // Validate number of files
        if (options.maxFiles && files.length > options.maxFiles) {
          setError(`Maximum ${options.maxFiles} files allowed`);
          resolve([]);
          return;
        }

        // Process files
        const selected: SelectedFile[] = [];
        
        for (const file of files) {
          // Validate file size
          if (options.maxSize && file.size > options.maxSize) {
            console.warn(`File ${file.name} exceeds size limit, skipping`);
            continue;
          }

          // Create preview for images
          let preview: string | undefined;
          if (file.type.startsWith('image/')) {
            preview = URL.createObjectURL(file);
          }

          selected.push({
            file,
            preview,
            size: file.size,
            type: file.type,
            name: file.name
          });
        }

        setSelectedFiles(selected);
        resolve(selected);
      };

      input.click();
    });
  }, []);

  // Upload file to Supabase Storage
  const uploadFile = useCallback(async (
    file: File | SelectedFile,
    options: UploadOptions
  ): Promise<string | null> => {
    setIsUploading(true);
    setError(null);
    setProgress(0);

    try {
      const actualFile = 'file' in file ? file.file : file;
      
      // Upload to Supabase
      const { data, error: uploadError } = await supabase.storage
        .from(options.bucket)
        .upload(options.path, actualFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(options.bucket)
        .getPublicUrl(options.path);

      setProgress(100);
      
      return publicUrl;
    } catch (err: any) {
      const errorMessage = err.message || 'Upload failed';
      setError(errorMessage);
      console.error('Upload error:', err);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  // Upload multiple files
  const uploadMultiple = useCallback(async (
    files: (File | SelectedFile)[],
    options: Omit<UploadOptions, 'path'> & { pathPrefix: string }
  ): Promise<string[]> => {
    setIsUploading(true);
    setError(null);

    const urls: string[] = [];
    const total = files.length;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const actualFile = 'file' in file ? file.file : file;
        const path = `${options.pathPrefix}/${actualFile.name}`;

        const url = await uploadFile(file, {
          bucket: options.bucket,
          path
        });

        if (url) {
          urls.push(url);
        }

        setProgress(((i + 1) / total) * 100);
      }

      return urls;
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      return urls;
    } finally {
      setIsUploading(false);
    }
  }, [uploadFile]);

  // Clear selected files
  const clearFiles = useCallback(() => {
    // Revoke object URLs to free memory
    selectedFiles.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    
    setSelectedFiles([]);
    setError(null);
    setProgress(0);
  }, [selectedFiles]);

  // Remove specific file
  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => {
      const file = prev[index];
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  // Validate file type
  const validateFileType = useCallback((
    file: File,
    allowedTypes: string[]
  ): boolean => {
    return allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        const category = type.split('/')[0];
        return file.type.startsWith(category + '/');
      }
      return file.type === type;
    });
  }, []);

  // Format file size
  const formatSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }, []);

  return {
    selectedFiles,
    isUploading,
    progress,
    error,
    selectFile,
    selectMultiple,
    uploadFile,
    uploadMultiple,
    clearFiles,
    removeFile,
    validateFileType,
    formatSize
  };
};
