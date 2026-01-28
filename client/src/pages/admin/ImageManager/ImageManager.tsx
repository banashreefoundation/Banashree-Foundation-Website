import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Label } from '../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Textarea } from '../../../components/ui/textarea';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './ImageManager.scss';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001/api/v1';

interface Image {
  _id: string;
  name: string;
  filename: string;
  originalName: string;
  category: string;
  key: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  description?: string;
  alt?: string;
  isActive: boolean;
  uploadedBy?: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

const ImageManager: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [sortField, setSortField] = useState<keyof Image | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [defaultImagesInfo, setDefaultImagesInfo] = useState<any>(null);
  const [importing, setImporting] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<Image | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Show 10 images per page
  
  // Suggested keys for each category
  const suggestedKeys: Record<string, string[]> = {
    hero: ['carousel'],
    logo: ['main', 'footer', 'favicon'],
    header: ['main', 'program', 'line'],
    backgrounds: ['rectBg', 'groupBg', 'children', 'greenBg', 'redBg', 'orangeBg'],
    empowerment: ['woman', 'education', 'health'],
    programs: ['animalWelfare', 'elderCare', 'childCare', 'farmerEmpowerment', 'communityBuilding', 'waterConservation', 'hero'],
    projects: ['goshala', 'waterProject', 'hero'],
    events: ['default1', 'default2', 'default3', 'hero'],
    campaigns: ['hero'],
    other: []
  };
  
  // Upload form state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    category: 'other',
    key: '',
    description: '',
    alt: '',
  });

  // Edit form state
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editFilePreview, setEditFilePreview] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    key: '',
    description: '',
    alt: '',
    isActive: true,
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Fetching images with token:', token ? 'Token exists' : 'No token');
      console.log('API URL:', `${API_BASE_URL}images/list`);
      
      const response = await fetch(`${API_BASE_URL}images/list`);
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setImages(data.data);
        console.log('Images set:', data.data.length);
      } else {
        console.error('API returned success=false:', data);
      }
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      if (!uploadForm.name) {
        setUploadForm(prev => ({
          ...prev,
          name: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
          alt: file.name.replace(/\.[^/.]+$/, ''),
        }));
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('image', uploadFile);
    formData.append('name', uploadForm.name);
    formData.append('category', uploadForm.category);
    formData.append('key', uploadForm.key || uploadFile.name);
    formData.append('description', uploadForm.description);
    formData.append('alt', uploadForm.alt);

    try {
      const response = await fetch(`${API_BASE_URL}images/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert('Image uploaded successfully!');
        setUploadDialogOpen(false);
        setUploadFile(null);
        setUploadForm({
          name: '',
          category: 'other',
          key: '',
          description: '',
          alt: '',
        });
        fetchImages();
      } else {
        alert(data.message || 'Failed to upload image');
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      alert('Failed to upload image');
    }
  };

  const handleEdit = (image: Image) => {
    setSelectedImage(image);
    setEditFile(null);
    setEditFilePreview(null);
    setEditForm({
      name: image.name,
      category: image.category,
      key: image.key,
      description: image.description || '',
      alt: image.alt || '',
      isActive: image.isActive,
    });
    setEditDialogOpen(true);
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setEditFile(null);
      setEditFilePreview(null);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;

    try {
      // If a new file is uploaded, use FormData, otherwise use JSON
      if (editFile) {
        const formData = new FormData();
        formData.append('image', editFile);
        formData.append('name', editForm.name);
        formData.append('category', editForm.category);
        formData.append('key', editForm.key);
        formData.append('description', editForm.description);
        formData.append('alt', editForm.alt);
        formData.append('isActive', String(editForm.isActive));

        const response = await fetch(`${API_BASE_URL}images/${selectedImage._id}`, {
          method: 'PUT',
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          alert('Image updated successfully with new file!');
          setEditDialogOpen(false);
          setSelectedImage(null);
          setEditFile(null);
          fetchImages();
        } else {
          alert(data.message || 'Failed to update image');
        }
      } else {
        // No new file, just update metadata
        const response = await fetch(`${API_BASE_URL}images/${selectedImage._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editForm),
        });

        const data = await response.json();

        if (data.success) {
          alert('Image metadata updated successfully!');
          setEditDialogOpen(false);
          setSelectedImage(null);
          fetchImages();
        } else {
          alert(data.message || 'Failed to update image');
        }
      }
    } catch (error: any) {
      console.error('Update failed:', error);
      alert('Failed to update image');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}images/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        alert('Image deleted successfully!');
        fetchImages();
      } else {
        alert(data.message || 'Failed to delete image');
      }
    } catch (error: any) {
      console.error('Delete failed:', error);
      alert('Failed to delete image');
    }
  };

  const fetchDefaultImagesInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}default-images/info`, {
        headers: {
          // 'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setDefaultImagesInfo(data);
      }
    } catch (error) {
      console.error('Failed to fetch default images info:', error);
    }
  };

  const handleImportDefaults = async () => {
    if (!confirm(`This will import ${defaultImagesInfo?.canImport || 0} default images. Continue?`)) return;

    try {
      setImporting(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}default-images/import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const message = data.imported > 0 
          ? `✅ Successfully imported ${data.imported} images!\n${data.skipped > 0 ? `(${data.skipped} already existed)` : ''}`
          : `All ${data.skipped} default images already exist in the database.`;
        
        alert(message);
        setImportDialogOpen(false);
        fetchImages();
      } else {
        let errorMessage = `❌ Failed to import: ${data.message}`;
        
        if (data.missingFiles && data.missingFiles.length > 0) {
          errorMessage += `\n\nMissing files (${data.missingFiles.length}):\n`;
          errorMessage += data.missingFiles.slice(0, 5).join('\n');
          if (data.missingFiles.length > 5) {
            errorMessage += `\n... and ${data.missingFiles.length - 5} more`;
          }
        }
        
        alert(errorMessage);
      }
    } catch (error: any) {
      console.error('Import failed:', error);
      alert('❌ Failed to import default images. Check console for details.');
    } finally {
      setImporting(false);
    }
  };

  const handleOpenImportDialog = () => {
    setImportDialogOpen(true);
    fetchDefaultImagesInfo();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleSort = (field: keyof Image) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredImages = images.filter(image =>
    image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort filtered images
  const sortedImages = [...filteredImages].sort((a, b) => {
    if (!sortField) return 0;

    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle undefined values
    if (aValue === undefined || aValue === null) return 1;
    if (bValue === undefined || bValue === null) return -1;

    // Convert to strings for comparison
    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();

    if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1;
    if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination calculations
  const totalPages = Math.ceil(sortedImages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedImages = sortedImages.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="image-manager">
      <div className="image-manager__header">
        <h1>Image Management</h1>
        <div className="image-manager__actions">
          <Input
            type="text"
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <Button onClick={handleOpenImportDialog} variant="outline" className="import-defaults-btn">
            Import Defaults
          </Button>
          <Button onClick={() => setUploadDialogOpen(true)} className="add-image-btn">
            <img src="../src/assets/images/plus-white.png" alt="Add" className="btn-icon" />
            Add New Image
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading images...</div>
      ) : (
        <div className="image-manager__table-container">
          <table className="image-table">
            <thead>
              <tr>
                <th>Preview</th>
                <th className="sortable" onClick={() => handleSort('name')}>
                  Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="sortable" onClick={() => handleSort('category')}>
                  Category {sortField === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="sortable" onClick={() => handleSort('key')}>
                  Key {sortField === 'key' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="sortable" onClick={() => handleSort('size')}>
                  Size {sortField === 'size' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th>Dimensions</th>
                <th className="sortable" onClick={() => handleSort('isActive')}>
                  Status {sortField === 'isActive' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedImages.length > 0 ? (
                paginatedImages.map((image) => (
                <tr key={image._id}>
                  <td>
                    <div 
                      className="image-preview" 
                      onClick={() => {
                        setPreviewImage(image);
                        setPreviewDialogOpen(true);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <img src={`http://localhost:4001${image.url}`} alt={image.alt || image.name} />
                    </div>
                  </td>
                  <td>
                    <div className="image-info">
                      <div className="image-name">{image.name}</div>
                      <div className="image-filename">{image.filename}</div>
                    </div>
                  </td>
                  <td>
                    <span className="category-badge">{image.category}</span>
                  </td>
                  <td className="key-cell">{image.key}</td>
                  <td>{formatFileSize(image.size)}</td>
                  <td>
                    {image.width && image.height
                      ? `${image.width} × ${image.height}`
                      : 'N/A'}
                  </td>
                  <td>
                    <span className={`status-badge ${image.isActive ? 'active' : 'inactive'}`}>
                      {image.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEdit(image)}
                      >
                        <img src="../src/assets/images/edit.png" alt="Edit" className="action-icon" />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(image._id)}
                      >
                        <img src="../src/assets/images/delete.png" alt="Delete" className="action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan={8} className="no-data-row">
                    {searchTerm ? 'No images found matching your search.' : 'No images uploaded yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {sortedImages.length > 0 && totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 mt-8 mb-6 font-poppins">
              {/* Page Info Card */}
              <div className="bg-white px-6 py-3 rounded-full shadow-md border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Page</span>
                  <div className="bg-[#830f00] text-white font-bold text-base px-4 py-1.5 rounded-full min-w-[40px] text-center">
                    {currentPage}
                  </div>
                  <span className="text-sm text-gray-600">of</span>
                  <div className="bg-gray-100 text-gray-700 font-bold text-base px-4 py-1.5 rounded-full min-w-[40px] text-center">
                    {totalPages}
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-[#830f00] text-white hover:bg-[#6b0d00] shadow-md hover:shadow-lg hover:scale-105'
                  }`}
                >
                  <ChevronLeft size={18} />
                  <span className="hidden sm:inline">Previous</span>
                </Button>

                {/* Showing info */}
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full border border-red-200">
                  <span className="text-red-700 text-sm font-medium">
                    {startIndex + 1}-{Math.min(endIndex, sortedImages.length)} of {sortedImages.length}
                  </span>
                </div>

                <Button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-[#830f00] text-white hover:bg-[#6b0d00] shadow-md hover:shadow-lg hover:scale-105'
                  }`}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={18} />
                </Button>
              </div>

              {/* Mobile showing info */}
              <div className="sm:hidden flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full border border-red-200">
                <span className="text-red-700 text-xs font-medium">
                  Showing {startIndex + 1}-{Math.min(endIndex, sortedImages.length)} of {sortedImages.length}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload New Image</DialogTitle>
            <DialogDescription>
              Upload a new image to the system
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpload}>
            <div className="space-y-4 max-h-[calc(90vh-200px)] overflow-y-auto px-1">
              <div>
                <Label htmlFor="file">Image File *</Label>
                <div className="mt-2">
                  <input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    required
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-hover file:cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={uploadForm.category}
                  onValueChange={(value) => setUploadForm(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="logo">Logo</SelectItem>
                    <SelectItem value="header">Header</SelectItem>
                    <SelectItem value="hero">Hero</SelectItem>
                    <SelectItem value="backgrounds">Backgrounds</SelectItem>
                    <SelectItem value="empowerment">Empowerment</SelectItem>
                    <SelectItem value="programs">Programs</SelectItem>
                    <SelectItem value="projects">Projects</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                    <SelectItem value="campaigns">Campaigns</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="key">Key *</Label>
                <Input
                  id="key"
                  value={uploadForm.key}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, key: e.target.value }))}
                  placeholder="Unique identifier for this image"
                  required
                />
                {suggestedKeys[uploadForm.category]?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 mb-1">Suggested keys (click to use):</p>
                    <div className="flex flex-wrap gap-1">
                      {suggestedKeys[uploadForm.category].map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setUploadForm(prev => ({ ...prev, key }))}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer transition-colors"
                        >
                          {key}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="alt">Alt Text</Label>
                <Input
                  id="alt"
                  value={uploadForm.alt}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, alt: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Upload</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update image metadata</DialogTitle>
            <DialogDescription>
              Update image metadata
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="space-y-4 max-h-[calc(90vh-200px)] overflow-y-auto px-1">
              {selectedImage && (
                <div className="image-preview-large">
                  <img 
                    src={editFilePreview || `http://localhost:4001${selectedImage.url}`} 
                    alt={selectedImage.alt || selectedImage.name} 
                  />
                </div>
              )}
              <div>
                <Label htmlFor="edit-file">Replace Image (optional)</Label>
                <div className="mt-2">
                  <input
                    id="edit-file"
                    type="file"
                    accept="image/*"
                    onChange={handleEditFileChange}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-hover file:cursor-pointer"
                  />
                  {editFile && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ {editFile.name}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={editForm.category}
                  onValueChange={(value) => setEditForm(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="logo">Logo</SelectItem>
                    <SelectItem value="header">Header</SelectItem>
                    <SelectItem value="hero">Hero</SelectItem>
                    <SelectItem value="backgrounds">Backgrounds</SelectItem>
                    <SelectItem value="empowerment">Empowerment</SelectItem>
                    <SelectItem value="programs">Programs</SelectItem>
                    <SelectItem value="projects">Projects</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                    <SelectItem value="campaigns">Campaigns</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Change category to group images together
                </p>
              </div>
              <div>
                <Label htmlFor="edit-key">Key *</Label>
                <Input
                  id="edit-key"
                  value={editForm.key}
                  onChange={(e) => setEditForm(prev => ({ ...prev, key: e.target.value }))}
                  required
                  placeholder="e.g., carousel for hero carousel"
                />
                {suggestedKeys[editForm.category]?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 mb-1">Suggested keys (click to use):</p>
                    <div className="flex flex-wrap gap-1">
                      {suggestedKeys[editForm.category].map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setEditForm(prev => ({ ...prev, key }))}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer transition-colors"
                        >
                          {key}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Use same key for multiple images to create a carousel. E.g., category="hero", key="carousel"
                </p>
              </div>
              <div>
                <Label htmlFor="edit-alt">Alt Text</Label>
                <Input
                  id="edit-alt"
                  value={editForm.alt}
                  onChange={(e) => setEditForm(prev => ({ ...prev, alt: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-isActive"
                  checked={editForm.isActive}
                  onChange={(e) => setEditForm(prev => ({ ...prev, isActive: e.target.checked }))}
                />
                <Label htmlFor="edit-isActive">Active</Label>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Import Default Images Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import Default Images</DialogTitle>
            <DialogDescription>
              Import default images from the server setup. This is useful when setting up a new environment.
            </DialogDescription>
          </DialogHeader>

          <div className="import-info">
            {defaultImagesInfo ? (
              <>
                <div className="info-summary">
                  <div className="info-row">
                    <strong>Total Default Images:</strong> 
                    <span className="badge">{defaultImagesInfo.totalDefaultImages}</span>
                  </div>
                  <div className="info-row">
                    <strong>Already Imported:</strong> 
                    <span className="badge badge-success">{defaultImagesInfo.alreadyImported}</span>
                  </div>
                  <div className="info-row">
                    <strong>Can Import:</strong> 
                    <span className="badge badge-primary">{defaultImagesInfo.canImport}</span>
                  </div>
                  {defaultImagesInfo.metadata && (
                    <div className="info-row">
                      <strong>Export Date:</strong> 
                      <span>{new Date(defaultImagesInfo.metadata.exportDate).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {defaultImagesInfo.canImportList && defaultImagesInfo.canImportList.length > 0 && (
                  <div className="images-list">
                    <h4 className="list-title">📥 Images to Import ({defaultImagesInfo.canImportList.length})</h4>
                    <div className="scrollable-list">
                      {defaultImagesInfo.canImportList.map((img: any, idx: number) => (
                        <div key={idx} className="image-item">
                          <span className="image-number">{idx + 1}.</span>
                          <div className="image-details">
                            <div className="image-name">{img.name}</div>
                            <div className="image-meta">
                              <span className="category-badge">{img.category}</span>
                              <span className="filename">{img.filename}</span>
                              <span className="filesize">{(img.size / 1024).toFixed(1)} KB</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {defaultImagesInfo.alreadyExistList && defaultImagesInfo.alreadyExistList.length > 0 && (
                  <div className="images-list">
                    <h4 className="list-title">✅ Already Imported ({defaultImagesInfo.alreadyExistList.length})</h4>
                    <div className="scrollable-list collapsed">
                      {defaultImagesInfo.alreadyExistList.slice(0, 5).map((img: any, idx: number) => (
                        <div key={idx} className="image-item existing">
                          <span className="image-number">{idx + 1}.</span>
                          <div className="image-details">
                            <div className="image-name">{img.name}</div>
                            <div className="image-meta">
                              <span className="category-badge">{img.category}</span>
                              <span className="filename">{img.filename}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {defaultImagesInfo.alreadyExistList.length > 5 && (
                        <div className="more-items">
                          ... and {defaultImagesInfo.alreadyExistList.length - 5} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="loading-state">
                <p>Loading default images information...</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleImportDefaults} 
              disabled={importing || (defaultImagesInfo && defaultImagesInfo.canImport === 0)}
            >
              {importing ? 'Importing...' : `Import ${defaultImagesInfo?.canImport || 0} Images`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Modal */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
            <DialogDescription>
              {previewImage?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Image Preview */}
            <div className="flex justify-center items-center bg-gray-100 rounded-lg p-4 min-h-[400px]">
              {previewImage && (
                <img 
                  src={`http://localhost:4001${previewImage.url}`} 
                  alt={previewImage.alt || previewImage.name}
                  className="max-w-full max-h-[600px] object-contain"
                />
              )}
            </div>
            
            {/* Image Details */}
            {previewImage && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Filename:</span> {previewImage.filename}
                </div>
                <div>
                  <span className="font-semibold">Category:</span> <span className="category-badge">{previewImage.category}</span>
                </div>
                <div>
                  <span className="font-semibold">Key:</span> {previewImage.key}
                </div>
                <div>
                  <span className="font-semibold">Size:</span> {formatFileSize(previewImage.size)}
                </div>
                <div>
                  <span className="font-semibold">Dimensions:</span> {previewImage.width && previewImage.height ? `${previewImage.width} × ${previewImage.height}` : 'N/A'}
                </div>
                <div>
                  <span className="font-semibold">Type:</span> {previewImage.mimeType}
                </div>
                {previewImage.description && (
                  <div className="col-span-2">
                    <span className="font-semibold">Description:</span> {previewImage.description}
                  </div>
                )}
                {previewImage.alt && (
                  <div className="col-span-2">
                    <span className="font-semibold">Alt Text:</span> {previewImage.alt}
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageManager;
