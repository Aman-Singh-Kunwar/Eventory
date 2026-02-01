import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, Upload, Link as LinkIcon } from "lucide-react";
import MoviePreviewModal from "../../components/MoviePreviewModal";

export default function AddMovie() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadType, setUploadType] = useState({ poster: 'file', background: 'file' });
  const [files, setFiles] = useState({ poster: null, background: null });
  const [previewUrls, setPreviewUrls] = useState({ poster: '', background: '' });
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    duration: "",
    language: "English",
    price: "250",
    posterUrl: "",
    backgroundUrl: "",
    trailerUrl: "",
    releaseDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFiles(prev => ({ ...prev, [name]: files[0] }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const toggleUploadType = (field) => {
    setUploadType(prev => ({ ...prev, [field]: prev[field] === 'file' ? 'url' : 'file' }));
    // Clear value of the other type
    if (uploadType[field] === 'file') {
      setFiles(prev => ({ ...prev, [field]: null }));
      setPreviewUrls(prev => ({ ...prev, [field]: '' }));
    } else {
      setFormData(prev => ({ ...prev, [`${field}Url`]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      const formPayload = new FormData();
      formPayload.append('title', formData.title);
      formPayload.append('description', formData.description);
      formPayload.append('genre', formData.genre);
      formPayload.append('duration', formData.duration);
      formPayload.append('language', formData.language);
      formPayload.append('price', formData.price);
      formPayload.append('releaseDate', formData.releaseDate);
      formPayload.append('trailerUrl', formData.trailerUrl);

      // Handle image fields
      if (uploadType.poster === 'file' && files.poster) {
        formPayload.append('poster', files.poster);
      } else if (formData.posterUrl) {
        formPayload.append('posterUrl', formData.posterUrl);
      }

      if (uploadType.background === 'file' && files.background) {
        formPayload.append('background', files.background);
      } else if (formData.backgroundUrl) {
        formPayload.append('backgroundUrl', formData.backgroundUrl);
      }

      await axios.post("http://localhost:5000/api/movies", formPayload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to add movie", error);
      alert("Failed to add movie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="min-h-screen bg-linear-to-br from-[#0d1117] via-[#0d1117] to-[#161b22] max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-400 hover:text-white mb-8 transition-all group"
      >
        <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </button>

      <div className="bg-[#0d1117]/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.3)] hover:border-white/20 transition-colors">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wider">Create a listing</p>
            <h1 className="text-4xl font-extrabold text-white">Add New Movie</h1>
            <p className="text-gray-400 mt-2">Poster, language, pricing, trailer, and release details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Movie Title</label>
              <input type="text" name="title" required className="input-field" onChange={handleChange} placeholder="Enter movie title" />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Genre (comma separated)</label>
              <input type="text" name="genre" placeholder="Action, Drama, Sci-Fi" required className="input-field" onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Description</label>
            <textarea name="description" rows="4" required className="input-field focus:ring-2 focus:ring-[rgb(var(--primary))]/30" onChange={handleChange} placeholder="Enter movie description"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Duration (minutes)</label>
              <input type="number" name="duration" required className="input-field" onChange={handleChange} placeholder="120" />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Language</label>
              <input type="text" name="language" className="input-field" value={formData.language} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Ticket Price (₹)</label>
              <input type="number" name="price" min="0" className="input-field" value={formData.price} onChange={handleChange} placeholder="250" />
            </div>
          </div>

          {/* Release Date */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Release Date</label>
            <input type="date" name="releaseDate" required className="input-field" onChange={handleChange} />
          </div>

          {/* Image Uploads Section Header */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Media & Content</p>
            <h3 className="text-xl font-bold text-white mt-1 mb-6">Upload Posters & Trailer</h3>
          </div>

          {/* Image Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Poster Image */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-gray-300 text-sm font-semibold">Poster Image</label>
                <button type="button" onClick={() => toggleUploadType('poster')} className="text-xs text-[rgb(var(--primary))] hover:text-red-400 transition-colors flex items-center gap-1 font-medium">
                  {uploadType.poster === 'file' ? <><LinkIcon className="w-3 h-3"/> URL</> : <><Upload className="w-3 h-3"/> Upload</>}
                </button>
              </div>
              
              {uploadType.poster === 'file' ? (
                <div className="relative border-2 border-dashed border-white/20 hover:border-[rgb(var(--primary))]/50 rounded-xl p-6 transition-all duration-300 text-center group cursor-pointer">
                  <input type="file" name="poster" onChange={handleFileChange} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required={!formData.posterUrl} />
                  {previewUrls.poster ? (
                    <div className="space-y-2">
                      <img src={previewUrls.poster} alt="Poster Preview" className="mx-auto h-40 object-contain rounded-lg" />
                      <p className="text-xs text-gray-400">Click to replace</p>
                    </div>
                  ) : (
                    <div className="py-10">
                       <Upload className="w-10 h-10 mx-auto text-gray-600 mb-3 group-hover:text-[rgb(var(--primary))]/50 transition-colors" />
                       <p className="text-sm font-medium text-gray-300">Click to upload poster</p>
                       <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
              ) : (
                <input type="url" name="posterUrl" placeholder="https://example.com/poster.jpg" className="input-field" value={formData.posterUrl} onChange={handleChange} required={!files.poster} />
              )}
            </div>

            {/* Background Image */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                 <label className="block text-gray-300 text-sm font-semibold">Background Image</label>
                 <button type="button" onClick={() => toggleUploadType('background')} className="text-xs text-[rgb(var(--primary))] hover:text-red-400 transition-colors flex items-center gap-1 font-medium">
                  {uploadType.background === 'file' ? <><LinkIcon className="w-3 h-3"/> URL</> : <><Upload className="w-3 h-3"/> Upload</>}
                </button>
              </div>

              {uploadType.background === 'file' ? (
                <div className="relative border-2 border-dashed border-white/20 hover:border-[rgb(var(--primary))]/50 rounded-xl p-6 transition-all duration-300 text-center group cursor-pointer">
                  <input type="file" name="background" onChange={handleFileChange} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  {previewUrls.background ? (
                    <div className="space-y-2">
                      <img src={previewUrls.background} alt="Background Preview" className="mx-auto h-40 object-contain rounded-lg" />
                      <p className="text-xs text-gray-400">Click to replace</p>
                    </div>
                  ) : (
                    <div className="py-10">
                       <Upload className="w-10 h-10 mx-auto text-gray-600 mb-3 group-hover:text-[rgb(var(--primary))]/50 transition-colors" />
                       <p className="text-sm font-medium text-gray-300">Click to upload background</p>
                       <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
              ) : (
                <input type="url" name="backgroundUrl" placeholder="https://example.com/bg.jpg" className="input-field" value={formData.backgroundUrl} onChange={handleChange} />
              )}
            </div>
          </div>

          {/* Trailer URL */}
          <div className="space-y-3 pt-2">
            <label className="block text-gray-300 text-sm font-semibold">Trailer URL</label>
            <input type="url" name="trailerUrl" placeholder="https://www.youtube.com/watch?v=..." className="input-field" value={formData.trailerUrl} onChange={handleChange} />
            <p className="text-gray-500 text-xs">YouTube link or direct video URL (optional)</p>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-white/10 flex items-center gap-3 flex-wrap">
            <button 
              type="submit" 
              disabled={loading} 
              className={`btn-primary px-8 font-semibold transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[0_20px_40px_rgba(229,9,20,0.2)]'}`}
            >
              {loading ? "Publishing..." : "Publish Movie"}
            </button>
            <button 
              type="button" 
              onClick={() => setShowPreview(true)} 
              className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg border border-white/20 transition-all duration-300 hover:border-white/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
            >
              Preview
            </button>
          </div>
        </form>
      </div>
    </div>
    {showPreview && (
      <MoviePreviewModal
        movie={{
          ...formData,
          genre: formData.genre.split(",").map((g) => g.trim()),
          duration: Number(formData.duration) || 0,
          language: formData.language,
          rating: 8.5,
          price: Number(formData.price) || 250,
          posterUrl: previewUrls.poster || formData.posterUrl,
          backgroundUrl: previewUrls.background || formData.backgroundUrl
        }}
        onClose={() => setShowPreview(false)}
      />
    )}
    </>
  );
}
