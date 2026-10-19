import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, FileWarning } from 'lucide-react';
import axios from 'axios';

export default function IngestionMatrix({ onUpload }) {
  const [dragActive, setDragActive] = useState(false);
  const [fileStatus, setFileStatus] = useState('idle'); // idle, uploading, success, error
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    setFileStatus('uploading');
    const formData = new FormData();
    formData.append("file", file);

    try {
      // We will hit the backend upload endpoint for validation
      const res = await axios.post("http://localhost:8000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFileStatus('success');
      setMessage(res.data.message || 'Dataset validated successfully.');
      
      // Simulate mapping the first row of uploaded data (Mock for now to test flow)
      // In production, we'd fetch actual parsed rows back from the API
      onUpload({
        "GRE Score": 290, "TOEFL Score": 90, "University Rating": 1,
        "SOP": 2.0, "LOR": 2.0, "CGPA": 6.8, "Research": 0
      });
      
    } catch (err) {
      setFileStatus('error');
      setMessage(err.response?.data?.detail || 'Failed to parse dataset schema.');
    }
  };

  return (
    <div className="bg-background border border-border p-6 rounded-md shadow-sm">
      <h2 className="text-lg font-bold mb-4 uppercase tracking-wider text-secondary">Dataset Ingestion Matrix</h2>
      
      <form 
        onDragEnter={handleDrag} 
        onDragLeave={handleDrag} 
        onDragOver={handleDrag} 
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-md transition-colors ${
          dragActive ? 'border-primary bg-gray-50' : 'border-border'
        }`}
      >
        <input 
          ref={inputRef}
          type="file" 
          accept=".csv"
          className="hidden" 
          onChange={handleChange}
        />
        
        {fileStatus === 'idle' && (
          <>
            <UploadCloud className="w-10 h-10 text-secondary mb-4" />
            <p className="text-sm font-medium mb-1">Drag and drop batch CSV here</p>
            <p className="text-xs text-secondary mb-4">Secure file ingestion zone</p>
            <button 
              type="button"
              onClick={() => inputRef.current.click()}
              className="px-4 py-2 bg-primary text-background text-sm font-medium rounded transition-colors hover:bg-gray-800"
            >
              Select Dataset
            </button>
          </>
        )}
        
        {fileStatus === 'uploading' && (
          <div className="flex flex-col items-center animate-pulse">
            <div className="w-8 h-8 border-4 border-t-primary border-r-transparent border-b-border border-l-border rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-medium">Validating schema & encrypting payload...</p>
          </div>
        )}
        
        {fileStatus === 'success' && (
          <div className="flex flex-col items-center text-success">
            <CheckCircle className="w-10 h-10 mb-4" />
            <p className="text-sm font-medium">{message}</p>
            <button type="button" onClick={() => setFileStatus('idle')} className="mt-4 text-xs underline text-secondary">Upload new batch</button>
          </div>
        )}
        
        {fileStatus === 'error' && (
          <div className="flex flex-col items-center text-error">
            <FileWarning className="w-10 h-10 mb-4" />
            <p className="text-sm font-medium">{message}</p>
            <button type="button" onClick={() => setFileStatus('idle')} className="mt-4 px-4 py-2 bg-primary text-background text-sm font-medium rounded">Try Again</button>
          </div>
        )}
      </form>
    </div>
  );
}
