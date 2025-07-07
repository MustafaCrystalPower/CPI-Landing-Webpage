import React, { useRef } from "react";
import { Upload, File, X } from "lucide-react";
import { cn } from "@/lib/utils";

const FileUpload = ({
  id,
  accept,
  multiple,
  required = false,
  onChange,
  className,
  label,
  description,
  maxSize,
  value,
}) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (onChange) {
      onChange(multiple ? files : files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileName = () => {
    if (!value) return null;
    if (multiple && value.length > 0) {
      return `${value.length} file(s) selected`;
    }
    if (!multiple && value) {
      return value.name;
    }
    return null;
  };

  const hasFile = multiple ? value && value.length > 0 : value;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        onClick={handleClick}
        className={cn(
          "relative border-2 border-dashed border-gray-300 rounded-lg p-6 transition-all duration-200 cursor-pointer hover:border-gray-400 hover:bg-gray-50",
          hasFile && "border-green-300 bg-green-50",
          "group"
        )}
      >
        <input
          ref={fileInputRef}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          required={required}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="text-center">
          <div
            className={cn(
              "mx-auto h-12 w-12 rounded-full flex items-center justify-center transition-colors duration-200",
              hasFile
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-500"
            )}
          >
            {hasFile ? (
              <File className="h-6 w-6" />
            ) : (
              <Upload className="h-6 w-6" />
            )}
          </div>

          <div className="mt-4">
            {hasFile ? (
              <div>
                <p className="text-sm font-medium text-green-600">
                  {getFileName()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Click to change file
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                  Click to upload {multiple ? "files" : "file"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {description || `Drag and drop or click to browse`}
                </p>
                {maxSize && (
                  <p className="text-xs text-gray-400 mt-1">
                    Max size: {maxSize}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
