import React, { useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  predictDisease,
  sendChatMessage,
  addUserMessage,
  clearPrediction,
  clearChat,
} from '../../redux/slices/chatbotSlice';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUploadCloud,
  FiSend,
  FiTrash2,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertTriangle,
  FiImage,
} from 'react-icons/fi';
import { TbPlant2, TbMicroscope, TbLeaf } from 'react-icons/tb';
import { FaUser } from 'react-icons/fa';

const PlantDoctorPage = () => {
  const dispatch = useDispatch();
  const {
    prediction,
    isPredicting,
    predictionError,
    messages,
    isLoading,
  } = useSelector((state) => state.chatbot);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const chatInputRef = useRef(null);

  // ─── File Handling ──────────────────────────────────
  const handleFile = useCallback((file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, WEBP)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File too large. Maximum size is 10MB.');
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files.length) {
      handleFile(e.target.files[0]);
    }
  };

  // ─── Disease Detection ──────────────────────────────
  const handleDetect = () => {
    if (!selectedFile) return;
    dispatch(clearChat());
    dispatch(predictDisease(selectedFile));
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    dispatch(clearPrediction());
    dispatch(clearChat());
  };

  // ─── Chat ───────────────────────────────────────────
  const handleSendChat = () => {
    const trimmed = chatInput.trim();
    if (!trimmed || isLoading) return;

    dispatch(addUserMessage(trimmed));
    setChatInput('');

    const history = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    dispatch(
      sendChatMessage({
        message: trimmed,
        disease: prediction?.disease || null,
        history,
      })
    );
  };

  const handleChatKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendChat();
    }
  };

  // Auto-scroll chat
  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Confidence color
  const getConfidenceColor = (conf) => {
    if (conf >= 80) return '#22c55e';
    if (conf >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f0fdf4 0%, #f8fafc 40%, #ffffff 100%)' }}>
      {/* Hero Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #166534 0%, #15803d 40%, #22c55e 100%)',
          padding: '60px 24px 80px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-30%',
            left: '-10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.15)',
              padding: '8px 20px',
              borderRadius: '50px',
              marginBottom: '20px',
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.9)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <TbMicroscope size={18} />
            AI-Powered Disease Detection
          </div>
          <h1
            style={{
              color: 'white',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 800,
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '-0.02em',
              margin: '0 0 12px',
            }}
          >
            Plant Doctor
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '1.05rem',
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Upload a photo of your plant leaf and our AI will instantly diagnose diseases
            and provide expert treatment advice tailored for Sri Lankan farmers.
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '-40px auto 0',
          padding: '0 24px 60px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: prediction ? '1fr 1fr' : '1fr',
            gap: '28px',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Upload + Results */}
          <motion.div layout>
            {/* Upload Card */}
            <div
              style={{
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 20px 60px -16px rgba(0,0,0,0.1)',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '28px 28px 0' }}>
                <h2
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#111827',
                    fontFamily: "'Outfit', sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '20px',
                  }}
                >
                  <FiUploadCloud style={{ color: '#22c55e' }} />
                  Upload Leaf Image
                </h2>

                {/* Drop Zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${isDragOver ? '#22c55e' : '#d1d5db'}`,
                    borderRadius: '20px',
                    padding: previewUrl ? '16px' : '48px 24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    background: isDragOver
                      ? 'rgba(34, 197, 94, 0.04)'
                      : '#fafafa',
                    position: 'relative',
                    minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Leaf preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '320px',
                        borderRadius: '12px',
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    <>
                      <FiImage
                        size={48}
                        style={{ color: '#9ca3af', marginBottom: '16px' }}
                      />
                      <p
                        style={{
                          color: '#6b7280',
                          fontSize: '0.95rem',
                          fontWeight: 500,
                        }}
                      >
                        Drag & drop your leaf photo here
                      </p>
                      <p
                        style={{
                          color: '#9ca3af',
                          fontSize: '0.8rem',
                          marginTop: '8px',
                        }}
                      >
                        or click to browse · JPG, PNG, WEBP (max 10MB)
                      </p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  padding: '20px 28px 28px',
                  display: 'flex',
                  gap: '12px',
                }}
              >
                <button
                  onClick={handleDetect}
                  disabled={!selectedFile || isPredicting}
                  style={{
                    flex: 1,
                    padding: '14px 24px',
                    borderRadius: '14px',
                    border: 'none',
                    background:
                      !selectedFile || isPredicting
                        ? '#e5e7eb'
                        : 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: !selectedFile || isPredicting ? '#9ca3af' : 'white',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    cursor:
                      !selectedFile || isPredicting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow:
                      selectedFile && !isPredicting
                        ? '0 8px 24px rgba(34, 197, 94, 0.3)'
                        : 'none',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {isPredicting ? (
                    <>
                      <FiRefreshCw
                        size={18}
                        style={{ animation: 'spin 1s linear infinite' }}
                      />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <TbMicroscope size={18} />
                      Detect Disease
                    </>
                  )}
                </button>
                {(selectedFile || prediction) && (
                  <button
                    onClick={handleReset}
                    style={{
                      padding: '14px 20px',
                      borderRadius: '14px',
                      border: '1px solid #e5e7eb',
                      background: 'white',
                      color: '#6b7280',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    <FiTrash2 size={16} />
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {predictionError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    marginTop: '20px',
                    padding: '20px 24px',
                    background: '#fef2f2',
                    borderRadius: '16px',
                    border: '1px solid #fecaca',
                    color: '#991b1b',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <FiAlertTriangle size={20} />
                  <div>
                    <strong>Detection Failed</strong>
                    <p style={{ margin: '4px 0 0', opacity: 0.8 }}>
                      {predictionError}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Card */}
            <AnimatePresence>
              {prediction && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    marginTop: '20px',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(0,0,0,0.06)',
                    boxShadow: '0 20px 60px -16px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Result Header */}
                  <div
                    style={{
                      padding: '24px 28px',
                      background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                      borderBottom: '1px solid #bbf7d0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '16px',
                        background: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      }}
                    >
                      <FiCheckCircle
                        size={24}
                        style={{ color: '#22c55e' }}
                      />
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          color: '#166534',
                          fontFamily: "'Outfit', sans-serif",
                          margin: 0,
                        }}
                      >
                        Analysis Complete
                      </h3>
                      <p
                        style={{
                          color: '#15803d',
                          fontSize: '0.8rem',
                          margin: '2px 0 0',
                        }}
                      >
                        AI has identified the condition
                      </p>
                    </div>
                  </div>

                  <div style={{ padding: '24px 28px' }}>
                    {/* Disease Name */}
                    <div style={{ marginBottom: '20px' }}>
                      <p
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: '6px',
                        }}
                      >
                        Disease Identified
                      </p>
                      <p
                        style={{
                          fontSize: '1.35rem',
                          fontWeight: 700,
                          color: '#111827',
                          fontFamily: "'Outfit', sans-serif",
                        }}
                      >
                        {prediction.disease}
                      </p>
                    </div>

                    {/* Confidence Bar */}
                    <div style={{ marginBottom: '24px' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '8px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          Confidence Level
                        </span>
                        <span
                          style={{
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            color: getConfidenceColor(prediction.confidence),
                          }}
                        >
                          {prediction.confidence}%
                        </span>
                      </div>
                      <div
                        style={{
                          height: '10px',
                          background: '#f3f4f6',
                          borderRadius: '10px',
                          overflow: 'hidden',
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${prediction.confidence}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          style={{
                            height: '100%',
                            borderRadius: '10px',
                            background: `linear-gradient(90deg, ${getConfidenceColor(prediction.confidence)}, ${getConfidenceColor(prediction.confidence)}cc)`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Expert Advice */}
                    {prediction.advice && (
                      <div
                        style={{
                          background: '#f8fafc',
                          borderRadius: '16px',
                          padding: '20px',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        <p
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <TbLeaf style={{ color: '#22c55e' }} />
                          Expert Advice
                        </p>
                        <p
                          style={{
                            color: '#374151',
                            fontSize: '0.9rem',
                            lineHeight: 1.7,
                          }}
                        >
                          {prediction.advice}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Column: Chat Panel (shows after prediction) */}
          <AnimatePresence>
            {prediction && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5 }}
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 20px 60px -16px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  height: 'fit-content',
                  minHeight: '500px',
                  maxHeight: '700px',
                  position: 'sticky',
                  top: '100px',
                }}
              >
                {/* Chat Header */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #166534, #15803d)',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                    }}
                  >
                    🌱
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '1rem',
                        fontFamily: "'Outfit', sans-serif",
                        margin: 0,
                      }}
                    >
                      Ask Plant Doctor
                    </p>
                    <p
                      style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.75rem',
                        margin: '2px 0 0',
                      }}
                    >
                      Ask follow-up questions about{' '}
                      <strong>{prediction.disease}</strong>
                    </p>
                  </div>
                  <button
                    onClick={() => dispatch(clearChat())}
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      border: 'none',
                      color: 'white',
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                    }}
                  >
                    <FiTrash2 />
                  </button>
                </div>

                {/* Chat Messages */}
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    minHeight: '300px',
                    maxHeight: '420px',
                    background: 'linear-gradient(180deg, #f8faf9, #fff)',
                  }}
                >
                  {messages.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '10px' }}>
                        💬
                      </div>
                      <p
                        style={{
                          color: '#166534',
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          marginBottom: '6px',
                        }}
                      >
                        Ask me anything!
                      </p>
                      <p
                        style={{
                          color: '#6b7280',
                          fontSize: '0.8rem',
                          lineHeight: 1.5,
                        }}
                      >
                        Treatment options, prevention tips, organic solutions...
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px',
                          justifyContent: 'center',
                          marginTop: '16px',
                        }}
                      >
                        {[
                          'How to treat this?',
                          'Organic solutions?',
                          'Prevention tips',
                        ].map((q, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              dispatch(addUserMessage(q));
                              dispatch(
                                sendChatMessage({
                                  message: q,
                                  disease: prediction?.disease,
                                  history: [],
                                })
                              );
                            }}
                            style={{
                              background: 'white',
                              border: '1px solid #e5e7eb',
                              borderRadius: '20px',
                              padding: '8px 14px',
                              fontSize: '0.75rem',
                              color: '#374151',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                            }}
                            onMouseOver={(e) => {
                              e.target.style.background = '#f0fdf4';
                              e.target.style.borderColor = '#22c55e';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.background = 'white';
                              e.target.style.borderColor = '#e5e7eb';
                            }}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        gap: '10px',
                        flexDirection:
                          msg.role === 'user' ? 'row-reverse' : 'row',
                        animation: 'msg-appear 0.3s ease-out',
                      }}
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.85rem',
                          flexShrink: 0,
                          background:
                            msg.role === 'user'
                              ? 'linear-gradient(135deg, #dbeafe, #bfdbfe)'
                              : 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                          color:
                            msg.role === 'user' ? '#1e40af' : '#166534',
                        }}
                      >
                        {msg.role === 'user' ? <FaUser /> : <TbPlant2 />}
                      </div>
                      <div
                        style={{
                          maxWidth: '78%',
                          padding: '12px 16px',
                          borderRadius: '18px',
                          fontSize: '0.85rem',
                          lineHeight: 1.55,
                          wordWrap: 'break-word',
                          ...(msg.role === 'user'
                            ? {
                                background:
                                  'linear-gradient(135deg, #22c55e, #16a34a)',
                                color: 'white',
                                borderBottomRightRadius: '6px',
                                boxShadow:
                                  '0 4px 12px rgba(34, 197, 94, 0.25)',
                              }
                            : {
                                background: 'white',
                                color: '#1f2937',
                                border: '1px solid #f3f4f6',
                                borderBottomLeftRadius: '6px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                              }),
                          ...(msg.isError
                            ? {
                                background: '#fef2f2',
                                color: '#991b1b',
                                borderColor: '#fecaca',
                              }
                            : {}),
                        }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {/* Typing */}
                  {isLoading && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background:
                            'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                          color: '#166534',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.85rem',
                        }}
                      >
                        <TbPlant2 />
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: '5px',
                          padding: '14px 18px',
                          background: 'white',
                          border: '1px solid #f3f4f6',
                          borderRadius: '18px',
                          borderBottomLeftRadius: '6px',
                        }}
                      >
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            style={{
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              background: '#9ca3af',
                              animation: `typing-bounce 1.4s ease-in-out ${i * 0.2}s infinite`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div
                  style={{
                    padding: '16px 20px',
                    borderTop: '1px solid #f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'white',
                  }}
                >
                  <input
                    ref={chatInputRef}
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleChatKeyDown}
                    placeholder="Ask about treatment, prevention..."
                    disabled={isLoading}
                    style={{
                      flex: 1,
                      border: '1.5px solid #e5e7eb',
                      borderRadius: '24px',
                      padding: '12px 18px',
                      fontSize: '0.85rem',
                      outline: 'none',
                      transition: 'all 0.25s',
                      background: '#fafafa',
                      fontFamily: "'Inter', sans-serif",
                      color: '#1f2937',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#22c55e';
                      e.target.style.background = 'white';
                      e.target.style.boxShadow =
                        '0 0 0 4px rgba(34, 197, 94, 0.08)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.background = '#fafafa';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    onClick={handleSendChat}
                    disabled={!chatInput.trim() || isLoading}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      border: 'none',
                      background:
                        !chatInput.trim() || isLoading
                          ? '#e5e7eb'
                          : 'linear-gradient(135deg, #22c55e, #16a34a)',
                      color:
                        !chatInput.trim() || isLoading ? '#9ca3af' : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor:
                        !chatInput.trim() || isLoading
                          ? 'not-allowed'
                          : 'pointer',
                      transition: 'all 0.25s',
                      fontSize: '1rem',
                      flexShrink: 0,
                    }}
                  >
                    <FiSend />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Supported Crops Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            marginTop: '40px',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 10px 40px -16px rgba(0,0,0,0.08)',
            padding: '32px',
          }}
        >
          <h3
            style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#111827',
              fontFamily: "'Outfit', sans-serif",
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
            }}
          >
            <TbLeaf style={{ color: '#22c55e' }} />
            Supported Crops & Diseases
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '12px',
            }}
          >
            {[
              { crop: '🍅 Tomato', diseases: '8 diseases detected' },
              { crop: '🥔 Potato', diseases: '3 conditions detected' },
              { crop: '🌶️ Bell Pepper', diseases: '2 conditions detected' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: '16px 20px',
                  background: '#f8fafc',
                  borderRadius: '14px',
                  border: '1px solid #f1f5f9',
                  transition: 'all 0.3s',
                }}
              >
                <p
                  style={{
                    fontWeight: 600,
                    color: '#111827',
                    fontSize: '0.95rem',
                    marginBottom: '4px',
                  }}
                >
                  {item.crop}
                </p>
                <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                  {item.diseases}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Keyframes for animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); background: #d1d5db; }
          30% { transform: translateY(-6px); background: #22c55e; }
        }
        @keyframes msg-appear {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .plant-doctor-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PlantDoctorPage;
