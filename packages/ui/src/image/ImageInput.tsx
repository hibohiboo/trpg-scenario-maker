import React, { useState, useRef } from 'react';

export default function ImageUploadDataUrlPreview() {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      setDataUrl(null);
      setFileName(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      // reader.result will be a data URL string
      setDataUrl(reader.result as string);
      setFileName(file.name);
    };
    reader.onerror = () => {
      setError('Failed to read file.');
      setDataUrl(null);
      setFileName(null);
    };
    reader.readAsDataURL(file);
  };

  const clear = () => {
    setDataUrl(null);
    setFileName(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const copyToClipboard = async () => {
    if (!dataUrl) return;
    await navigator.clipboard.writeText(dataUrl);
    alert('Data URL copied to clipboard.');
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <label className="block text-sm font-medium mb-2">Upload an image</label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="block w-full text-sm text-gray-700 file:border file:px-3 file:py-2 file:rounded file:bg-gray-100"
      />

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {dataUrl && (
        <div className="mt-4">
          <div className="mb-2">
            <strong className="mr-2">File:</strong>
            <span>{fileName}</span>
          </div>

          <div className="border rounded p-3 inline-block">
            {/* Preview with fixed width 300px */}
            <img
              src={dataUrl}
              alt="preview"
              style={{ width: 300, height: 'auto' }}
            />
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={copyToClipboard}
              className="px-3 py-2 rounded shadow-sm border hover:opacity-90"
            >
              Copy data URL
            </button>
            <button
              onClick={clear}
              className="px-3 py-2 rounded shadow-sm border hover:opacity-90"
            >
              Clear
            </button>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium mb-1">Data URL</label>
            <textarea
              readOnly
              value={dataUrl}
              rows={4}
              className="w-full text-xs p-2 rounded border resize-none"
            />
          </div>
        </div>
      )}

      {!dataUrl && (
        <p className="text-gray-600 mt-3">
          No image selected. Preview will appear here when you choose a file.
        </p>
      )}
    </div>
  );
}
