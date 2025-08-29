import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Camera } from "lucide-react";

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  maxImages?: number;
  accept?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function ImageUpload({
  onImageUpload,
  maxImages = 1,
  accept = "image/*",
  className = "",
  children
}: ImageUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setUploadedImages(prev => [...prev, result]);
          onImageUpload(file);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      {children}
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
          ${dragOver ? 'border-primary bg-primary/5' : 'border-input hover:border-primary'}
          ${uploadedImages.length >= maxImages ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileSelector}
        data-testid="image-upload-area"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={maxImages > 1}
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
          data-testid="file-input"
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-primary" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Upload Images
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop images here, or click to select files
            </p>
            <Button type="button" variant="outline" data-testid="button-select-files">
              <Camera className="w-4 h-4 mr-2" />
              Select Files
            </Button>
          </div>
        </div>
      </div>

      {/* Image Previews */}
      {uploadedImages.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-foreground mb-3">Uploaded Images</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map((src, index) => (
              <div key={index} className="relative group">
                <img
                  src={src}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                  data-testid={`image-preview-${index}`}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  data-testid={`button-remove-image-${index}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
