import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Upload, Trash2, RefreshCw, CheckCircle, XCircle, AlertCircle, FileJson, Download } from "lucide-react";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Get API URL from environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001/api/v1/';

type MessageType = 'success' | 'error' | 'warning' | 'info';
type EntityType = 'programs' | 'projects' | 'events' | 'campaigns';

interface Message {
  type: MessageType;
  text: string;
  timestamp: Date;
}

export default function SeedDataView() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedEntityType, setSelectedEntityType] = useState<EntityType>('programs');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const addMessage = (type: MessageType, text: string) => {
    const newMessage: Message = {
      type,
      text,
      timestamp: new Date()
    };
    setMessages(prev => [newMessage, ...prev]);
  };

  const handleSeedData = async (cleanMode: boolean) => {
    setLoading(true);
    addMessage('info', `Starting seed operation in ${cleanMode ? 'CLEAN' : 'UPSERT'} mode...`);

    try {
      const response = await fetch(`${API_BASE_URL}seed-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cleanMode })
      });

      const data = await response.json();

      if (response.ok) {
        addMessage('success', data.message || 'Seed data operation completed successfully!');
        if (data.details) {
          addMessage('info', `Programs: ${data.details.programs || 0}, Projects: ${data.details.projects || 0}, Events: ${data.details.events || 0}, Campaigns: ${data.details.campaigns || 0}`);
        }
        toast.success('Database seeded successfully!');
      } else {
        addMessage('error', data.error || 'Failed to seed data');
        toast.error('Seed operation failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addMessage('error', `Error: ${errorMessage}`);
      toast.error('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDefaultImages = async () => {
    if (!confirm('This will import default images from the server. Continue?')) return;
    
    setLoading(true);
    addMessage('info', 'Starting import of default images...');

    try {
      const response = await fetch(`${API_BASE_URL}default-images/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success) {
        if (data.imported > 0) {
          addMessage('success', `✅ Successfully imported ${data.imported} images!`);
          if (data.skipped > 0) {
            addMessage('info', `${data.skipped} images already existed in database`);
          }
          toast.success(`Imported ${data.imported} images!`);
        } else {
          addMessage('info', `All ${data.skipped} default images already exist in database`);
          toast.info('All images already imported');
        }
      } else {
        let errorMsg = data.message || 'Failed to import default images';
        if (data.missingFiles && data.missingFiles.length > 0) {
          addMessage('error', `${errorMsg} - ${data.missingFiles.length} files missing`);
          addMessage('warning', `Missing files: ${data.missingFiles.slice(0, 3).join(', ')}${data.missingFiles.length > 3 ? '...' : ''}`);
        } else {
          addMessage('error', errorMsg);
        }
        toast.error('Import failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addMessage('error', `Error: ${errorMessage}`);
      toast.error('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/json') {
        addMessage('error', 'Please select a valid JSON file');
        toast.error('Invalid file type');
        return;
      }
      setSelectedFile(file);
      addMessage('info', `Selected file: ${file.name}`);
    }
  };

  const handleUploadJSON = async () => {
    if (!selectedFile) {
      addMessage('error', 'Please select a JSON file first');
      toast.error('No file selected');
      return;
    }

    setLoading(true);
    addMessage('info', `Uploading ${selectedEntityType} from ${selectedFile.name}...`);

    try {
      const fileContent = await selectedFile.text();
      const jsonData = JSON.parse(fileContent);

      if (!Array.isArray(jsonData)) {
        addMessage('error', 'JSON file must contain an array of records');
        toast.error('Invalid JSON format');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}upload-json-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityType: selectedEntityType,
          data: jsonData
        })
      });

      const result = await response.json();

      if (response.ok) {
        addMessage('success', result.message || 'JSON data uploaded successfully!');
        if (result.inserted !== undefined) {
          addMessage('info', `Records inserted: ${result.inserted}, Updated: ${result.updated || 0}`);
        }
        toast.success(`${selectedEntityType} uploaded successfully!`);
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById('json-file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        addMessage('error', result.error || 'Failed to upload JSON data');
        toast.error('Upload failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addMessage('error', `Error: ${errorMessage}`);
      toast.error('Failed to process JSON file');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSchema = async () => {
    setLoading(true);
    addMessage('info', `Downloading ${selectedEntityType} schema...`);

    try {
      const response = await fetch(`${API_BASE_URL}download-schema/${selectedEntityType}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedEntityType}-schema.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        addMessage('success', `${selectedEntityType} schema downloaded successfully!`);
        toast.success('Schema downloaded!');
      } else {
        const data = await response.json();
        addMessage('error', data.error || 'Failed to download schema');
        toast.error('Download failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addMessage('error', `Error: ${errorMessage}`);
      toast.error('Failed to download schema');
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    addMessage('info', 'Messages cleared');
  };

  const getMessageIcon = (type: MessageType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  const getMessageBgColor = (type: MessageType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
        <h1 className="text-4xl font-poppins-extra-bold text-gray-900">Data Management</h1>
        <p className="text-gray-600 mt-3 font-poppins-medium text-lg">Seed database and manage default images with powerful tools</p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Seed Data Card */}
        <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-white hover:-translate-y-1 group">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-600 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300">
                <Database className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-poppins-bold text-gray-900">Seed Database</CardTitle>
                <CardDescription className="text-sm font-poppins-regular text-gray-600 mt-1">
                  Populate database with sample data
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-3">
              <Button
                onClick={() => handleSeedData(true)}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-poppins-semi-bold flex items-center justify-center gap-3 h-12 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-5 h-5" />
                Clean & Seed (Delete All)
              </Button>
              <Button
                onClick={() => handleSeedData(false)}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-poppins-semi-bold flex items-center justify-center gap-3 h-12 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className="w-5 h-5" />
                Upsert Seed (Update/Insert)
              </Button>
            </div>
            <div className="text-sm text-gray-700 bg-blue-50 p-5 rounded-xl border border-blue-200">
              <p className="font-poppins-bold mb-3 text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                Options:
              </p>
              <ul className="space-y-3 text-xs font-poppins-regular text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-red-600 mt-0.5">●</span>
                  <span><strong className="text-gray-900 font-poppins-semi-bold">Clean Mode:</strong> Deletes all existing data and inserts fresh records</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 mt-0.5">●</span>
                  <span><strong className="text-gray-900 font-poppins-semi-bold">Upsert Mode:</strong> Updates existing records or inserts new ones</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Upload JSON Data Card */}
        <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-white hover:-translate-y-1 group">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-orange-600 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300">
                <FileJson className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-poppins-bold text-gray-900">Upload JSON Data</CardTitle>
                <CardDescription className="text-sm font-poppins-regular text-gray-600 mt-1">
                  Import multiple records from JSON file
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-poppins-semi-bold text-gray-900 mb-3 block">
                  Select Entity Type
                </label>
                <Select value={selectedEntityType} onValueChange={(value) => setSelectedEntityType(value as EntityType)}>
                  <SelectTrigger className="w-full h-12 font-poppins-medium border-2 border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-xl bg-white hover:border-orange-500 transition-colors">
                    <SelectValue placeholder="Select entity type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="programs" className="font-poppins-medium">Programs</SelectItem>
                    <SelectItem value="projects" className="font-poppins-medium">Projects</SelectItem>
                    <SelectItem value="events" className="font-poppins-medium">Events</SelectItem>
                    <SelectItem value="campaigns" className="font-poppins-medium">Campaigns</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-poppins-semi-bold text-gray-900 mb-3 block">
                  Select JSON File
                </label>
                <input
                  id="json-file-input"
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="w-full text-sm text-gray-700 font-poppins-regular file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-poppins-semi-bold file:bg-orange-600 file:text-white hover:file:bg-orange-700 file:shadow-md hover:file:shadow-lg file:transition-all file:duration-300 cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-3 hover:border-orange-500 hover:bg-orange-50 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
                {selectedFile && (
                  <p className="text-xs text-green-700 mt-3 font-poppins-semi-bold flex items-center gap-2 bg-green-50 p-2 rounded-lg border border-green-200">
                    <CheckCircle className="w-4 h-4" /> {selectedFile.name}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleDownloadSchema}
                  disabled={loading}
                  variant="outline"
                  className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-poppins-semi-bold flex items-center justify-center gap-2 h-12 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <Download className="w-5 h-5" />
                  Download Schema
                </Button>
                <Button
                  onClick={handleUploadJSON}
                  disabled={loading || !selectedFile}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-poppins-semi-bold flex items-center justify-center gap-2 h-12 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-5 h-5" />
                  Upload
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-700 bg-orange-50 p-5 rounded-xl border border-orange-200">
              <p className="font-poppins-bold mb-3 text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
                Info:
              </p>
              <ul className="space-y-3 text-xs font-poppins-regular text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 mt-0.5">●</span>
                  <span>Download schema template to see required fields</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 mt-0.5">●</span>
                  <span>Upload multiple records at once</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 mt-0.5">●</span>
                  <span>JSON must be an array of objects</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 mt-0.5">●</span>
                  <span>Existing records will be updated (upsert)</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Upload Default Images Card */}
        <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-white hover:-translate-y-1 group">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-600 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-poppins-bold text-gray-900">Default Images</CardTitle>
                <CardDescription className="text-sm font-poppins-regular text-gray-600 mt-1">
                  Import default images to database
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <Button
              onClick={handleUploadDefaultImages}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-poppins-semi-bold flex items-center justify-center gap-3 h-12 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-5 h-5" />
              Import Default Images
            </Button>
            <div className="text-sm text-gray-700 bg-purple-50 p-5 rounded-xl border border-purple-200">
              <p className="font-poppins-bold mb-3 text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                Info:
              </p>
              <ul className="space-y-3 text-xs font-poppins-regular text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 mt-0.5">●</span>
                  <span>Imports images from default-images.json</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 mt-0.5">●</span>
                  <span>Skips images that already exist</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 mt-0.5">●</span>
                  <span>Verifies files exist before importing</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages Log */}
      <Card className="border border-gray-200 shadow-lg bg-white overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4 bg-white border-b border-gray-200">
          <div>
            <CardTitle className="text-2xl font-poppins-bold text-gray-900 flex items-center gap-3">
              <span className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center shadow-md">
                <AlertCircle className="w-6 h-6 text-white" />
              </span>
              Operation Log
            </CardTitle>
            <CardDescription className="text-sm font-poppins-regular text-gray-600 mt-2 ml-13">View real-time status messages</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearMessages}
            disabled={messages.length === 0}
            className="font-poppins-semi-bold border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-xl px-4 py-2 transition-all duration-300 disabled:opacity-40"
          >
            Clear Log
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {messages.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="font-poppins-semi-bold text-gray-500 text-lg">No messages yet</p>
                <p className="font-poppins-regular text-gray-400 text-sm mt-2">Perform an operation to see logs here</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${getMessageBgColor(message.type)} flex items-start gap-4 transition-all hover:shadow-md`}
                >
                  {getMessageIcon(message.type)}
                  <div className="flex-1">
                    <p className="text-sm font-poppins-semi-bold text-gray-900 leading-relaxed">{message.text}</p>
                    <p className="text-xs text-gray-500 mt-2 font-poppins-regular">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-5 max-w-md">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin" />
            <div className="text-center">
              <p className="text-xl font-poppins-bold text-gray-900 mb-2">Processing...</p>
              <p className="text-sm text-gray-600 font-poppins-medium">Please wait while the operation completes</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
