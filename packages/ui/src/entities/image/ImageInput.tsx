import { dataUrlToBlob } from '@trpg-scenario-maker/utility';
import React, { useState, useRef, type DragEvent, useId } from 'react';

export default function ImageUploadDataUrlPreview({
  viewDataUrl = false,
  onChangeDataUrl,
}: {
  viewDataUrl: boolean;
  onChangeDataUrl: (url: string) => void;
}) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const labelId = useId();
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      setDataUrl(null);
      setFileName(null);
      onChangeDataUrl('');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setDataUrl(reader.result as string);
      setFileName(file.name);
      onChangeDataUrl(reader.result as string);
    };
    reader.onerror = () => {
      setError('Failed to read file.');
      setDataUrl(null);
      setFileName(null);
      onChangeDataUrl('');
    };
    reader.readAsDataURL(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files && e.target.files[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const clear = () => {
    setDataUrl(null);
    setFileName(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const copyToClipboard = async () => {
    if (!dataUrl) return;
    try {
      await navigator.clipboard.writeText(dataUrl);
      alert('Data URL copied to clipboard.');
    } catch (e) {
      console.warn(e);
      alert('Copy failed — try selecting the text manually.');
    }
  };
  const downloadImage = () => {
    if (!dataUrl) return;
    const blob = dataUrlToBlob(dataUrl);
    // ▼ BlobからURLを作りダウンロード
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'downloaded_image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <label className="block text-sm font-medium mb-2" htmlFor={labelId}>
        画像をアップロード
      </label>

      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 ${
          isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
        }`}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
          id={labelId}
        />
        <p className="text-gray-600">
          {isDragging
            ? 'ここにドロップしてください'
            : '画像をドラッグ&ドロップ'}
        </p>
      </div>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {dataUrl && (
        <div className="mt-4">
          <div className="mb-2">
            <strong className="mr-2">File:</strong>
            <span>{fileName}</span>
          </div>

          <div className="border rounded p-3 inline-block">
            <img
              src={dataUrl}
              alt="preview"
              style={{ width: 300, height: 'auto' }}
            />
          </div>
          {viewDataUrl && (
            <>
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
                <label className="block text-sm font-medium mb-1">
                  Data URL
                </label>
                <textarea
                  readOnly
                  value={dataUrl}
                  rows={4}
                  className="w-full text-xs p-2 rounded border resize-none"
                />
              </div>

              <button
                onClick={downloadImage}
                disabled={!dataUrl}
                className="px-3 py-2 border rounded"
              >
                Download Image
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
