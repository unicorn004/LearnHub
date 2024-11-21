import { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Upload,
  X, 
  CheckCircle 
} from 'lucide-react';

// Mock initial resources (in a real app, this would come from backend)
const initialResources = [
  {
    id: 1,
    title: 'Machine Learning Basics',
    type: 'PDF',
    uploadedBy: 'John Doe',
    uploadDate: '2024-02-15',
    subject: 'Computer Science',
    fileSize: '2.5 MB',
    downloadCount: 34
  },
  {
    id: 2,
    title: 'Advanced Calculus Notes',
    type: 'PDF',
    uploadedBy: 'Jane Smith',
    uploadDate: '2024-02-10',
    subject: 'Mathematics',
    fileSize: '1.8 MB',
    downloadCount: 22
  },
  {
    id: 3,
    title: 'Data Structures Interview Prep',
    type: 'PDF',
    uploadedBy: 'Alice Johnson',
    uploadDate: '2024-02-12',
    subject: 'Computer Science',
    fileSize: '3.2 MB',
    downloadCount: 45
  }
];

const ResourceSharingPage = () => {
  const [resources, setResources] = useState(initialResources);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResources, setFilteredResources] = useState(initialResources);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSubject, setUploadSubject] = useState('');

  // Search functionality
  useEffect(() => {
    const filtered = resources.filter(resource => 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResources(filtered);
  }, [searchTerm, resources]);

  // File upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setUploadFile(file);
  };

  // Submit upload
  const submitUpload = (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle || !uploadSubject) {
      alert('Please fill all fields');
      return;
    }

    const newResource = {
      id: resources.length + 1,
      title: uploadTitle,
      type: uploadFile.type.split('/').pop().toUpperCase(),
      uploadedBy: 'Current User', // In real app, get from auth
      uploadDate: new Date().toISOString().split('T')[0],
      subject: uploadSubject,
      fileSize: `${(uploadFile.size / 1024 / 1024).toFixed(2)} MB`,
      downloadCount: 0
    };

    setResources([...resources, newResource]);
    
    // Reset form
    setUploadFile(null);
    setUploadTitle('');
    setUploadSubject('');
    
    // Close modal or reset upload state
  };

  // Download handler (mock)
  const handleDownload = (resource) => {
    alert(`Downloading: ${resource.title}`);
    // In real app, implement actual download logic
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Resource Sharing Platform
        </h1>

        {/* Search and Filter Section */}
        <div className="mb-6 flex space-x-4">
          <div className="relative flex-grow">
            <input 
              type="text" 
              placeholder="Search resources by name, subject, or uploader"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Upload Resource Button */}
          <button 
            className="bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center hover:bg-blue-700 transition"
            onClick={() => document.getElementById('upload-modal').classList.remove('hidden')}
          >
            <Upload className="mr-2" /> Upload
          </button>
        </div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div 
              key={resource.id} 
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <FileText className="text-blue-600 mr-3" />
                  <h3 className="font-semibold text-lg">{resource.title}</h3>
                </div>
                <span className="text-sm text-gray-500">{resource.type}</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Uploaded by: {resource.uploadedBy}</p>
                <p>Date: {resource.uploadDate}</p>
                <p>Subject: {resource.subject}</p>
                <p>File Size: {resource.fileSize}</p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Downloads: {resource.downloadCount}
                </span>
                <button 
                  onClick={() => handleDownload(resource)}
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition flex items-center"
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Download
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Modal */}
        <div 
          id="upload-modal" 
          className="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        >
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Upload Resource</h2>
              <button 
                onClick={() => document.getElementById('upload-modal').classList.add('hidden')}
                className="text-gray-500 hover:text-gray-800"
              >
                <X />
              </button>
            </div>
            <form onSubmit={submitUpload} className="space-y-4">
              <div>
                <label className="block mb-2">Resource Title</label>
                <input 
                  type="text" 
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Enter resource title"
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Subject</label>
                <input 
                  type="text" 
                  value={uploadSubject}
                  onChange={(e) => setUploadSubject(e.target.value)}
                  placeholder="Enter subject"
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Upload File</label>
                <input 
                  type="file" 
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 border rounded-lg"
                  accept=".pdf,.doc,.docx,.txt"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Upload Resource
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceSharingPage;