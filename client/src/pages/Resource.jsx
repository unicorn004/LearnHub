import { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Upload,
  X, 
  CheckCircle 
} from 'lucide-react';

const ResourceSharingPage = () => {
  // State declarations
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResources, setFilteredResources] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSubject, setUploadSubject] = useState('');
  const [uploadDescription, setUploadDescription] = useState("");
  // Fetch resources on component mount
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/resource", {
          headers: {
            "x-auth-token": localStorage.getItem("authToken"), // Updated to use x-auth-token
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            console.error("Unauthorized access. Please log in again.");
            setResources([]); // Reset resources on unauthorized access
            setFilteredResources([]); // Reset filtered resources
            return;
          }
          throw new Error("Failed to fetch resources");
        }

        const data = await response.json();
        setResources(data);
        setFilteredResources(data); // Initialize filtered resources
      } catch (error) {
        console.error("Error fetching resources:", error);
        setResources([]); // Ensure it's an array
        setFilteredResources([]); // Ensure it's an array
      }
    };

    fetchResources();
  }, []);

  // Search functionality
  useEffect(() => {
    const filtered = resources.filter(resource => 
      (resource.title && resource.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (resource.subject && resource.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (resource.uploadedBy && resource.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    setFilteredResources(filtered);
  }, [searchTerm, resources]);

  // File upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setUploadFile(file);
  };

  // Submit upload to backend
  const submitUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle || !uploadSubject) {
      alert('Please fill all fields');
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("name", uploadTitle);
    formData.append("topic", uploadSubject);
    formData.append("description", uploadDescription);

    try {
      const response = await fetch("http://localhost:5000/api/resource/upload", {
        method: "POST",
        headers: {
          "x-auth-token": localStorage.getItem("authToken"), // Updated to use x-auth-token
        },
        body: formData,
      });

      if (response.ok) {
        const {resource} = await response.json();
        setResources([...resources, resource]);
        alert(`File uploaded successfully! View here: ${resource.fileUrl}`);
      } else {
        alert("Failed to upload resource");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file");
    }

    // Reset form
    setUploadFile(null);
    setUploadTitle('');
    setUploadSubject('');
  };

  // Download handler
  const handleDownload = async (resource) => {
    
    const response = await fetch(resource.fileUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = resource.title || 'downloaded_file'; // Fallback name if title is undefined
    document.body.appendChild(a);
    a.click();
    a.remove();
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
              key={resource.id || resource.title} // Use a unique identifier
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
    <label className="block mb-2">Description</label>
    <textarea 
      value={uploadDescription}
      onChange={(e) => setUploadDescription(e.target.value)}
      placeholder="Enter a description"
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
