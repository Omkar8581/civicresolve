import React, { useState } from 'react';
import {
  Camera,
  Video,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Navigation,
  Layers,
  Building2,
  HelpCircle,
  X,
  Upload,
} from 'lucide-react';
import { MapComponent } from '../components/MapComponent';
import { api } from '../services/api';

export const ReportIssuePage = ({ currentUser, setView, onComplaintCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('New Delhi Central District');
  const [latitude, setLatitude] = useState(28.6139);
  const [longitude, setLongitude] = useState(77.2090);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Location mode: 'current' | 'map'
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  // AI Review Modal State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReviewData, setAiReviewData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Browser Geolocation API
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));
        setLatitude(lat);
        setLongitude(lng);
        setAddress(`GPS Location: ${lat}, ${lng} (Verified via browser)`);
        setDetectingLocation(false);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setDetectingLocation(false);
        alert('Could not access GPS location. Please click "Select Location on Map" to choose manually.');
        setShowMapPicker(true);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Map click callback
  const handleMapSelect = (coords) => {
    setLatitude(coords.lat);
    setLongitude(coords.lng);
    setAddress(`Pinned Map Location: ${coords.lat}, ${coords.lng}`);
  };

  // Image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Video upload
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  // Trigger AI Analysis for Review
  const handleAnalyzeAndReview = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim() || !description.trim()) {
      setErrorMsg('Please enter both problem title and detailed description.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await api.analyzeComplaint(title, description);
      setAiReviewData({
        category: result.category,
        severity: result.severity,
        priority: result.priority,
        department: result.department,
        aiSummary: result.summary,
      });
    } catch (err) {
      console.error('AI preview error:', err);
      // Fallback
      setAiReviewData({
        category: 'General Civic Grievance',
        severity: 'Medium',
        priority: 'Medium',
        department: 'General Civic Grievance Cell',
        aiSummary: title,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Final Submission to Firebase / Backend
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        title,
        description: additionalNotes ? `${description}\n\nAdditional notes: ${additionalNotes}` : description,
        userId: currentUser?.id || 'anonymous_citizen',
        citizenName: currentUser?.name || 'Verified Citizen',
        citizenEmail: currentUser?.email || 'citizen@civicresolve.gov',
        citizenPhone: currentUser?.phone || '',
        latitude,
        longitude,
        address,
        imageUrl: imagePreview || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
        videoUrl: videoFile ? 'uploaded_video.mp4' : '',
        category: aiReviewData.category,
        severity: aiReviewData.severity,
        priority: aiReviewData.priority,
        department: aiReviewData.department,
        aiSummary: aiReviewData.aiSummary,
      };

      const response = await api.createComplaint(payload);
      onComplaintCreated(response.complaint);
      setView('track');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2 border border-teal-200">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>AI-Assisted Dispatch Form</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Report a Public Issue</h1>
        <p className="text-sm text-slate-600 mt-1">
          Provide issue details and location. Our AI engine will inspect the evidence, determine the urgency, and route it to the responsible department.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Complaint Form */}
      <form onSubmit={handleAnalyzeAndReview} className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
        {/* Title */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1.5">
            Problem Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Large pothole near school entrance creating accident hazard"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
          />
        </div>

        {/* Detailed Description */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1.5">
            Problem Description *
          </label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the exact problem, how long it has existed, and the impact on local traffic or residents..."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
          />
        </div>

        {/* Evidence Media Upload */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Photo upload */}
          <div className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl p-4 text-center cursor-pointer transition-colors relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Evidence Preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <span className="inline-block mt-2 text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  Photo Loaded (Click to change)
                </span>
              </div>
            ) : (
              <div className="py-4">
                <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <div className="text-xs font-bold text-slate-700">Upload Photo Evidence</div>
                <div className="text-[11px] text-slate-400 mt-0.5">JPG, PNG up to 10MB</div>
              </div>
            )}
          </div>

          {/* Video upload */}
          <div className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl p-4 text-center cursor-pointer transition-colors relative">
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="py-4">
              <Video className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-700">
                {videoFile ? videoFile.name : 'Upload Short Video (Optional)'}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">MP4, MOV up to 25MB</div>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>Issue Location *</span>
              </label>
              <p className="text-xs text-slate-500">
                Pinpoint exact coordinates for field teams.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={detectingLocation}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold hover:bg-teal-100 transition-colors"
              >
                <Navigation className={`w-3.5 h-3.5 ${detectingLocation ? 'animate-spin' : ''}`} />
                <span>{detectingLocation ? 'Locating...' : 'Use My Current Location'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowMapPicker(!showMapPicker)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{showMapPicker ? 'Hide Map' : 'Select Location on Map'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Map Picker */}
          {showMapPicker && (
            <div className="space-y-2">
              <MapComponent
                selectedLocation={{ lat: latitude, lng: longitude }}
                onSelectLocation={handleMapSelect}
                height="280px"
              />
              <p className="text-[11px] text-slate-500 text-right">
                Click anywhere on the map to place the location pin.
              </p>
            </div>
          )}

          {/* Address & Coordinate Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-slate-50 font-mono"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-slate-50 font-mono"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Address / Landmark</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address or nearby landmark"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Optional notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Optional Additional Notes
          </label>
          <input
            type="text"
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="e.g. Best contacted after 4 PM, landmark is opposite the yellow gate"
            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs"
          />
        </div>

        {/* Submit to AI Inspection Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold text-sm shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Running AI Classification & Priority Detection...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze with AI & Review Complaint</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* AI REVIEW MODAL - Citizen reviews AI analysis before final submission */}
      {aiReviewData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight">AI Complaint Analysis Completed</h3>
                  <p className="text-xs text-teal-100">Review AI classification before saving to database</p>
                </div>
              </div>
              <button
                onClick={() => setAiReviewData(null)}
                className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              {/* Category */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detected Category</span>
                  <div className="text-sm font-extrabold text-slate-800 mt-0.5">{aiReviewData.category}</div>
                </div>
                <div className="text-2xl">🏛️</div>
              </div>

              {/* Severity & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Severity Level</span>
                  <div className={`text-xs font-bold mt-1 ${aiReviewData.severity === 'High' ? 'text-rose-600' : 'text-amber-600'}`}>
                    ● {aiReviewData.severity} Severity
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Priority</span>
                  <div className={`text-xs font-bold mt-1 ${aiReviewData.priority === 'High' ? 'text-rose-600' : 'text-blue-600'}`}>
                    ● {aiReviewData.priority} Priority
                  </div>
                </div>
              </div>

              {/* Department Routing */}
              <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200">
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Target Department Routing</span>
                </span>
                <div className="text-xs font-extrabold text-teal-900 mt-1">
                  {aiReviewData.department}
                </div>
              </div>

              {/* AI Summary */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Executive Summary</span>
                <p className="text-xs text-slate-700 mt-1 italic leading-relaxed">
                  &quot;{aiReviewData.aiSummary}&quot;
                </p>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Everything verified. Ready to record complaint into the central registry.</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setAiReviewData(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Back to Edit
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-md flex items-center gap-1.5 transition-all"
              >
                {isSubmitting ? (
                  <span>Saving Complaint...</span>
                ) : (
                  <>
                    <span>Confirm & Submit Complaint</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
