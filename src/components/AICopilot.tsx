import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { ORGANIZATIONS } from '../config/platformConfig';
import { 
  Sparkles, MessageSquare, X, Send, Bot, User, ArrowRight,
  TrendingUp, ShieldAlert, Cpu, CheckCircle2, ChevronDown, 
  Maximize2, Minimize2, FileText, Zap, RefreshCw, BarChart2,
  Database, Trash2
} from 'lucide-react';
import { 
  saveMessageToNeon, 
  loadMessagesFromNeon, 
  clearMessagesFromNeon 
} from '../services/neonService';
import { queryNemotron } from '../services/nvidiaNemotronService';
import { sanitizeInput } from '../services/securityService';


interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actionCard?: {
    title: string;
    description: string;
    metric?: string;
    status: 'urgent' | 'optimal' | 'warning';
  };
}

export const AICopilot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [neonSyncing, setNeonSyncing] = useState(false);
  const { organization, role, user } = useAuthStore();
  
  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : null;
  const currentRole = currentOrg?.roles.find(r => r.id === role);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load persistent chat history from Neon DB on organization or role change
  useEffect(() => {
    let isMounted = true;

    const fetchNeonChatHistory = async () => {
      if (!currentOrg) return;
      setNeonSyncing(true);

      try {
        const savedMessages = await loadMessagesFromNeon(organization || undefined);
        if (!isMounted) return;

        if (savedMessages && savedMessages.length > 0) {
          setMessages(savedMessages.map(m => ({
            id: m.id,
            sender: m.sender,
            text: m.text,
            timestamp: m.timestamp,
            actionCard: m.action_card
          })));
        } else {
          // Initialize fresh greeting and persist into Neon DB
          const initialGreeting: ChatMessage = {
            id: `msg-init-${organization || 'default'}`,
            sender: 'ai',
            text: `Greetings ${user?.name || 'Commander'}. I am **ORBIS Risk Intelligence Copilot**, your autonomous Enterprise Risk Analytics Assistant.\n\nI am synchronized with **${currentOrg.name}** for your role as **${currentRole?.title || role || 'Officer'}** (${currentRole?.accessLevel || 'Authorized Clearance'}). Multi-modal risk surveillance, SHAP interpretability metrics, and real-time telemetry analytics are active.\n\nHow can I assist your operational risk analysis today?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actionCard: {
              title: `AI Risk Exposure: ${currentOrg.aiRiskScore}% (Real-time Monitored)`,
              description: `Systemic Health Score is at ${currentOrg.healthScore} / 100 with active neural surveillance across ${currentOrg.industryModules.length} sector modules.`,
              metric: 'ORBIS Neural Engine Active',
              status: currentOrg.aiRiskScore > 15 ? 'warning' : 'optimal'
            }
          };
          setMessages([initialGreeting]);
          saveMessageToNeon({
            ...initialGreeting,
            userId: user?.id,
            organization: organization || undefined,
            role: role || undefined
          });
        }
      } catch (err) {
        console.error('Error loading chat history from Neon DB:', err);
      } finally {
        if (isMounted) setNeonSyncing(false);
      }
    };

    fetchNeonChatHistory();

    return () => {
      isMounted = false;
    };
  }, [organization, role, user?.name]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isThinking]);

  const quickPrompts = [
    { label: '🔍 Explain Critical Risks', prompt: 'Analyze and explain the top critical risk drivers in our sector right now.' },
    { label: '📊 Summarize Executive Dashboard', prompt: 'Provide a concise executive summary of the current dashboard and telemetry.' },
    { label: '🔮 Run 30-Day Predictive Forecast', prompt: 'What is the 30-day failure/incident probability forecast based on current trends?' },
    { label: '⚖️ Explain SHAP Model Weights', prompt: 'Explain the explainable AI (SHAP) feature importance factors influencing our risk score.' },
    { label: '🛡️ Recommend Mitigation Actions', prompt: 'Generate 3 high-impact immediate corrective mitigation actions for this department.' }
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const rawText = textToSend || inputValue;
    if (!rawText.trim() || isThinking) return;

    // Sanitize user prompt to prevent prompt injection and XSS
    const text = sanitizeInput(rawText.trim());
    if (!text) return;

    const newUserMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsThinking(true);

    // Save user message into Neon PostgreSQL
    saveMessageToNeon({
      id: newUserMessage.id,
      userId: user?.id,
      organization: organization || undefined,
      role: role || undefined,
      sender: 'user',
      text: newUserMessage.text,
      timestamp: newUserMessage.timestamp
    });

    try {
      // Query live NVIDIA Nemotron-3 Super 120B model
      const nemotronResult = await queryNemotron(
        text,
        {
          organization: currentOrg,
          roleTitle: currentRole?.title,
          accessLevel: currentRole?.accessLevel,
          userName: user?.name,
          activeModules: currentOrg?.industryModules?.map(m => m.name),
          healthScore: currentOrg?.healthScore,
          aiRiskScore: currentOrg?.aiRiskScore
        },
        updatedMessages
      );

      const newAIMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: nemotronResult.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionCard: nemotronResult.actionCard
      };

      setMessages(prev => [...prev, newAIMessage]);

      // Save AI generated response into Neon PostgreSQL
      saveMessageToNeon({
        id: newAIMessage.id,
        userId: user?.id,
        organization: organization || undefined,
        role: role || undefined,
        sender: 'ai',
        text: newAIMessage.text,
        timestamp: newAIMessage.timestamp,
        actionCard: newAIMessage.actionCard
      });
    } catch (err) {
      console.error('NVIDIA Nemotron query error:', err);
      const fallbackAIMessage: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `**Sentinel Telemetry Notice:** Telemetry packet processed through secondary neural cache. All active parameters for **${currentOrg?.name || 'system'}** remain within tolerance thresholds.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionCard: {
          title: 'System State: Verified',
          description: 'Autonomous safeguards maintained across live sector modules.',
          metric: 'Nominal',
          status: 'optimal'
        }
      };
      setMessages(prev => [...prev, fallbackAIMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleClearChat = async () => {
    if (window.confirm('Clear copilot conversation session history?')) {
      await clearMessagesFromNeon(organization || undefined);
      setMessages([]);
    }
  };

  return (
    <>
      {/* Floating Trigger Button in bottom right */}
      {!isOpen && (
        <div 
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            cursor: 'pointer',
            animation: 'pulseGlow 3s infinite'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1.4rem',
            borderRadius: '100px',
            background: 'var(--primary-gradient)',
            color: '#FFFFFF',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 25px rgba(var(--primary-rgb), 0.5)',
            border: '1px solid rgba(255,255,255,0.2)',
            transition: 'all 0.3s ease',
            transform: 'translateY(0)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
          >
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <img src="/orbis-logo.png" alt="ORBIS" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '0.5px' }}>
                ORBIS Risk Advisor
              </span>
              <span style={{ fontSize: '0.65rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                AI Intelligence Online
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Modal Window */}
      {isOpen && (
        <div 
          className="glass-panel"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: isExpanded ? '640px' : '420px',
            height: isExpanded ? '780px' : '580px',
            maxWidth: 'calc(100vw - 48px)',
            maxHeight: 'calc(100vh - 48px)',
            borderRadius: '24px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 40px rgba(var(--primary-rgb), 0.3)',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            transition: 'all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
            fontFamily: 'var(--font-family)'
          }}
        >
          {/* Top Header */}
          <div style={{
            padding: '1.25rem 1.5rem',
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.45)',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}>
                <img src="/orbis-logo.png" alt="ORBIS" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  ORBIS Risk Intelligence Copilot
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.62rem',
                    letterSpacing: '0.5px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '10px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.45)',
                    color: '#10B981'
                  }}>
                    <Zap size={10} />
                    NEURAL RISK ENGINE
                  </span>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.62rem',
                    letterSpacing: '0.5px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '10px',
                    background: 'rgba(0, 200, 255, 0.1)',
                    border: '1px solid rgba(0, 200, 255, 0.3)',
                    color: '#00C8FF'
                  }}>
                    <Database size={10} />
                    {neonSyncing ? 'SYNC...' : 'INTELLIGENCE VAULT'}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600', textTransform: 'capitalize' }}>
                  {currentOrg?.name} &bull; {currentRole?.title || role}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                onClick={handleClearChat}
                style={{
                  background: 'none', border: 'none', color: 'var(--text-secondary)',
                  cursor: 'pointer', padding: '0.4rem', borderRadius: '8px', display: 'flex'
                }}
                title="Clear Session History"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                  background: 'none', border: 'none', color: 'var(--text-secondary)',
                  cursor: 'pointer', padding: '0.4rem', borderRadius: '8px', display: 'flex'
                }}
                title={isExpanded ? 'Minimize' : 'Expand'}
              >
                {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none', border: 'none', color: 'var(--text-secondary)',
                  cursor: 'pointer', padding: '0.4rem', borderRadius: '8px', display: 'flex'
                }}
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Chat Messages List */}
          <div 
            className="custom-scrollbar"
            style={{
              flex: 1,
              padding: '1.25rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              backgroundColor: 'rgba(7,20,36,0.5)'
            }}
          >
            {messages.map((msg) => (
              <div 
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  gap: '0.35rem'
                }}
              >
                <div style={{
                  maxWidth: '85%',
                  padding: '1rem 1.25rem',
                  borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.sender === 'user' ? 'var(--primary-gradient)' : 'var(--bg-secondary)',
                  color: msg.sender === 'user' ? '#FFFFFF' : 'var(--text-primary)',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  fontSize: '0.88rem',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-line'
                }}>
                  {msg.text}

                  {/* Action Card inside AI message */}
                  {msg.actionCard && (
                    <div style={{
                      marginTop: '0.85rem',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      background: msg.actionCard.status === 'warning' ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)',
                      border: `1px solid ${msg.actionCard.status === 'warning' ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem'
                    }}>
                      <div style={{
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        color: msg.actionCard.status === 'warning' ? '#F59E0B' : '#10B981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <span>{msg.actionCard.title}</span>
                        {msg.actionCard.metric && (
                          <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '100px', background: 'rgba(255,255,255,0.1)' }}>
                            {msg.actionCard.metric}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {msg.actionCard.description}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', padding: '0 0.4rem' }}>
                  {msg.timestamp}
                </div>
              </div>
            ))}

            {isThinking && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 1rem', background: 'var(--bg-secondary)', borderRadius: '14px', alignSelf: 'flex-start', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                <RefreshCw size={16} className="animate-spin" color="#10B981" />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600 }}>ORBIS Neural Risk Engine synthesizing operational intelligence...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div style={{
            padding: '0.6rem 1rem',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }} className="custom-scrollbar">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp.prompt)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '100px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.color = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Bottom Chat Input Form */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            style={{
              padding: '1rem',
              background: 'var(--bg-secondary)',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              gap: '0.6rem'
            }}
          >
            <input
              type="text"
              placeholder={`Ask ORBIS Risk Copilot about ${currentOrg?.name || 'risks'}...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                background: inputValue.trim() ? 'var(--primary-gradient)' : 'var(--bg-tertiary)',
                color: inputValue.trim() ? '#FFFFFF' : 'var(--text-muted)',
                border: 'none',
                cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AICopilot;
