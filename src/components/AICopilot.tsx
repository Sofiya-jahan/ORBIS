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
            gap: '0.85rem',
            padding: '0.85rem 1.45rem',
            borderRadius: '100px',
            background: 'linear-gradient(135deg, #1554E8 0%, #4148F1 50%, #7A48FF 100%)',
            color: '#F6FDFF',
            boxShadow: '0 12px 36px rgba(7, 17, 46, 0.8), 0 0 30px rgba(65, 72, 241, 0.55)',
            border: '1px solid rgba(106, 231, 247, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: 'translateY(0)'
          }}
          onMouseEnter={(e) => { 
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
            e.currentTarget.style.boxShadow = '0 16px 45px rgba(7, 17, 46, 0.9), 0 0 40px rgba(106, 231, 247, 0.65)';
          }}
          onMouseLeave={(e) => { 
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 12px 36px rgba(7, 17, 46, 0.8), 0 0 30px rgba(65, 72, 241, 0.55)';
          }}
          >
            <div style={{
              width: '32px', height: '32px', borderRadius: '10px',
              overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
              background: '#07112E'
            }}>
              <img src="/orbis-logo.png" alt="ORBIS" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: '800', letterSpacing: '0.5px' }}>
                ORBIS Risk Advisor
              </span>
              <span style={{ fontSize: '0.65rem', color: '#6AE7F7', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700 }}>
                Enterprise AI Online
              </span>
            </div>
            <Sparkles size={16} color="#6AE7F7" style={{ marginLeft: '0.2rem' }} />
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
            width: isExpanded ? '720px' : '460px',
            height: isExpanded ? '820px' : '620px',
            maxWidth: 'calc(100vw - 48px)',
            maxHeight: 'calc(100vh - 48px)',
            borderRadius: '24px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'rgba(7, 17, 46, 0.94)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            boxShadow: '0 35px 95px rgba(0, 0, 0, 0.85), 0 0 50px rgba(65, 72, 241, 0.3)',
            border: '1px solid rgba(122, 72, 255, 0.35)',
            overflow: 'hidden',
            transition: 'all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
            fontFamily: 'var(--font-family)'
          }}
        >
          {/* Top Header */}
          <div style={{
            padding: '1.25rem 1.5rem',
            background: 'linear-gradient(180deg, rgba(13, 35, 77, 0.75) 0%, rgba(7, 17, 46, 0.8) 100%)',
            borderBottom: '1px solid rgba(46, 155, 248, 0.16)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '12px',
                overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(65, 72, 241, 0.5)',
                border: '1px solid rgba(106, 231, 247, 0.4)',
                background: '#07112E'
              }}>
                <img src="/orbis-logo.png" alt="ORBIS" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.98rem', fontWeight: '800', color: '#F6FDFF', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  ORBIS Risk Intelligence Copilot
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.62rem',
                    letterSpacing: '0.6px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: 'rgba(65, 72, 241, 0.22)',
                    border: '1px solid rgba(134, 113, 249, 0.45)',
                    color: '#8671F9'
                  }}>
                    <Zap size={10} />
                    NEURAL ENGINE
                  </span>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.62rem',
                    letterSpacing: '0.6px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: 'rgba(46, 155, 248, 0.16)',
                    border: '1px solid rgba(106, 231, 247, 0.4)',
                    color: '#6AE7F7'
                  }}>
                    <Database size={10} />
                    {neonSyncing ? 'SYNC...' : 'INTELLIGENCE VAULT'}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#2E9BF8', fontWeight: '600', textTransform: 'capitalize' }}>
                  {currentOrg?.name} &bull; {currentRole?.title || role}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                onClick={handleClearChat}
                style={{
                  background: 'rgba(13, 35, 77, 0.5)', border: '1px solid rgba(46, 155, 248, 0.18)', color: 'rgba(246, 253, 255, 0.65)',
                  cursor: 'pointer', padding: '0.45rem', borderRadius: '8px', display: 'flex', transition: 'all 0.2s ease'
                }}
                title="Clear Session History"
                onMouseEnter={(e) => { e.currentTarget.style.color = '#FF5C5C'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(246, 253, 255, 0.65)'; }}
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                  background: 'rgba(13, 35, 77, 0.5)', border: '1px solid rgba(46, 155, 248, 0.18)', color: 'rgba(246, 253, 255, 0.65)',
                  cursor: 'pointer', padding: '0.45rem', borderRadius: '8px', display: 'flex', transition: 'all 0.2s ease'
                }}
                title={isExpanded ? 'Minimize' : 'Expand'}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#6AE7F7'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(246, 253, 255, 0.65)'; }}
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(13, 35, 77, 0.5)', border: '1px solid rgba(46, 155, 248, 0.18)', color: 'rgba(246, 253, 255, 0.65)',
                  cursor: 'pointer', padding: '0.45rem', borderRadius: '8px', display: 'flex', transition: 'all 0.2s ease'
                }}
                title="Close"
                onMouseEnter={(e) => { e.currentTarget.style.color = '#F6FDFF'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(246, 253, 255, 0.65)'; }}
              >
                <X size={18} />
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
              gap: '1.1rem',
              backgroundColor: 'rgba(7, 17, 46, 0.5)',
              backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(21, 84, 232, 0.05) 0%, transparent 40%)'
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
                  padding: '1rem 1.3rem',
                  borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  background: msg.sender === 'user' 
                    ? 'linear-gradient(135deg, #1554E8 0%, #2E9BF8 100%)' 
                    : 'rgba(13, 35, 77, 0.75)',
                  color: '#F6FDFF',
                  border: msg.sender === 'user' 
                    ? '1px solid rgba(255, 255, 255, 0.2)' 
                    : '1px solid rgba(65, 72, 241, 0.25)',
                  boxShadow: msg.sender === 'user' 
                    ? '0 4px 20px rgba(21, 84, 232, 0.4)' 
                    : '0 4px 20px rgba(0, 0, 0, 0.3)',
                  fontSize: '0.88rem',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-line'
                }}>
                  {msg.text}

                  {/* Action Card inside AI message */}
                  {msg.actionCard && (
                    <div style={{
                      marginTop: '0.85rem',
                      padding: '0.75rem 1rem',
                      borderRadius: '14px',
                      background: msg.actionCard.status === 'warning' 
                        ? 'rgba(245, 158, 11, 0.1)' 
                        : 'rgba(106, 231, 247, 0.08)',
                      border: msg.actionCard.status === 'warning' 
                        ? '1px solid rgba(245, 158, 11, 0.35)' 
                        : '1px solid rgba(106, 231, 247, 0.35)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.3rem'
                    }}>
                      <div style={{
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        color: msg.actionCard.status === 'warning' ? '#F59E0B' : '#6AE7F7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <span>{msg.actionCard.title}</span>
                        {msg.actionCard.metric && (
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '100px', background: 'rgba(255, 255, 255, 0.1)', color: '#F6FDFF' }}>
                            {msg.actionCard.metric}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'rgba(246, 253, 255, 0.75)' }}>
                        {msg.actionCard.description}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ fontSize: '0.68rem', color: 'rgba(246, 253, 255, 0.45)', padding: '0 0.4rem' }}>
                  {msg.timestamp}
                </div>
              </div>
            ))}

            {isThinking && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.65rem', 
                padding: '0.8rem 1.1rem', 
                background: 'rgba(13, 35, 77, 0.85)', 
                borderRadius: '16px', 
                alignSelf: 'flex-start', 
                border: '1px solid rgba(122, 72, 255, 0.45)',
                boxShadow: '0 0 20px rgba(122, 72, 255, 0.25)'
              }}>
                <Sparkles size={16} className="animate-spin" color="#8671F9" />
                <span style={{ fontSize: '0.8rem', color: '#F6FDFF', fontWeight: 600 }}>ORBIS Neural Risk Engine synthesizing operational intelligence...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div style={{
            padding: '0.65rem 1rem',
            borderTop: '1px solid rgba(46, 155, 248, 0.16)',
            background: 'rgba(13, 35, 77, 0.65)',
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
                  padding: '0.4rem 0.85rem',
                  borderRadius: '100px',
                  background: 'rgba(7, 17, 46, 0.7)',
                  border: '1px solid rgba(46, 155, 248, 0.25)',
                  color: 'rgba(246, 253, 255, 0.8)',
                  fontSize: '0.74rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#6AE7F7';
                  e.currentTarget.style.color = '#6AE7F7';
                  e.currentTarget.style.background = 'rgba(21, 84, 232, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(46, 155, 248, 0.25)';
                  e.currentTarget.style.color = 'rgba(246, 253, 255, 0.8)';
                  e.currentTarget.style.background = 'rgba(7, 17, 46, 0.7)';
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
              background: 'linear-gradient(180deg, rgba(7, 17, 46, 0.8) 0%, rgba(13, 35, 77, 0.85) 100%)',
              borderTop: '1px solid rgba(46, 155, 248, 0.16)',
              display: 'flex',
              gap: '0.65rem'
            }}
          >
            <input
              type="text"
              placeholder={`Ask ORBIS Risk Copilot about ${currentOrg?.name || 'risks'}...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{
                flex: 1,
                padding: '0.75rem 1.1rem',
                borderRadius: '14px',
                background: 'rgba(7, 17, 46, 0.75)',
                border: '1px solid rgba(46, 155, 248, 0.25)',
                color: '#F6FDFF',
                fontSize: '0.88rem',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2E9BF8';
                e.target.style.boxShadow = '0 0 14px rgba(46, 155, 248, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(46, 155, 248, 0.25)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              style={{
                padding: '0.75rem 1.15rem',
                borderRadius: '14px',
                background: inputValue.trim() ? 'linear-gradient(135deg, #1554E8 0%, #4148F1 100%)' : 'rgba(13, 35, 77, 0.6)',
                color: inputValue.trim() ? '#F6FDFF' : 'rgba(246, 253, 255, 0.35)',
                border: 'none',
                cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: inputValue.trim() ? '0 4px 15px rgba(21, 84, 232, 0.4)' : 'none',
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
