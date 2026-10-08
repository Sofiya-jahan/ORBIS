import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { ORGANIZATIONS } from '../config/platformConfig';
import { 
  Sparkles, MessageSquare, X, Send, Bot, User, ArrowRight,
  TrendingUp, ShieldAlert, Cpu, CheckCircle2, ChevronDown, 
  Maximize2, Minimize2, FileText, Zap, RefreshCw, BarChart2
} from 'lucide-react';

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
  const { organization, role, user } = useAuthStore();
  
  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : null;
  const currentRole = currentOrg?.roles.find(r => r.id === role);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize greeting on org/role change
  useEffect(() => {
    if (currentOrg) {
      const initialGreeting: ChatMessage = {
        id: 'msg-init',
        sender: 'ai',
        text: `Greetings ${user?.name || 'Commander'}. I am your IPRAP Cognitive Copilot configured for **${currentOrg.name}** in the role of **${currentRole?.title || role || 'Officer'}**.\n\nAll real-time neural models, SHAP feature weights, and risk mitigation registers are synchronized. How can I assist your operational intelligence today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionCard: {
          title: `Active AI Risk Exposure: ${currentOrg.aiRiskScore}%`,
          description: `Organizational Health Score is currently at ${currentOrg.healthScore} / 100 with zero uncontained systemic vulnerabilities.`,
          metric: `${currentOrg.industryModules.length} Sector Modules Live`,
          status: currentOrg.aiRiskScore > 15 ? 'warning' : 'optimal'
        }
      };
      setMessages([initialGreeting]);
    }
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

  const generateAIResponse = (userPrompt: string): { text: string; actionCard?: ChatMessage['actionCard'] } => {
    const orgName = currentOrg?.name || 'Enterprise System';
    const roleTitle = currentRole?.title || 'Lead Specialist';

    if (userPrompt.includes('Critical Risks') || userPrompt.includes('explain the top critical risk')) {
      return {
        text: `**Neural Vulnerability Scan for ${orgName}:**\n\n1. **High-Frequency Variance:** Neural cluster detected a 4.2% anomalous spike in primary sector metrics over the last 18 hours.\n2. **Mitigation Velocity:** Assigned mitigation response latency is currently **14.2 minutes**, well within the SLA threshold of 30 minutes.\n3. **Containment Index:** 98.6% of automated guardrails are actively dampening risk propagation.`,
        actionCard: {
          title: 'Immediate AI Recommendation',
          description: 'Deploy automated load redistribution and increase telemetry sampling to 1,000Hz on primary nodes.',
          metric: 'Risk Reduction: -3.8%',
          status: 'warning'
        }
      };
    }

    if (userPrompt.includes('Summarize') || userPrompt.includes('executive summary')) {
      return {
        text: `**Executive Briefing for ${roleTitle} (${orgName}):**\n\n- **Overall Health Score:** ${currentOrg?.healthScore || 95}/100 (**Optimal**)\n- **Active Anomaly Flags:** 2 low-severity signals under active autonomous isolation.\n- **Regulatory Compliance:** 100% adherence to all statutory and institutional controls.\n- **Forecast Horizon:** Probability of systemic disruption over the next 14 business days is estimated at **< 1.8%**.`,
        actionCard: {
          title: 'System Health Status: NOMINAL',
          description: 'All baseline parameters operating within 99% confidence interval.',
          metric: '100% Compliance',
          status: 'optimal'
        }
      };
    }

    if (userPrompt.includes('30-Day') || userPrompt.includes('predictive forecast')) {
      return {
        text: `**Monte Carlo 30-Day Forward Projection:**\n\nSimulating 10,000 scenario paths using real-time covariance matrices across ${currentOrg?.departments.join(', ')}:\n\n- **Base Case Probability:** 92.4% stability throughout Q4.\n- **Worst-Case Tail Risk:** 3.2% likelihood of threshold breach under severe external stress.\n- **Optimal Action Path:** Maintain current buffer reserves and review automated escalation rules on Day 15.`,
        actionCard: {
          title: 'Forward Horizon Simulation Complete',
          description: 'Model confidence score evaluated at 96.8% via recursive validation.',
          metric: '96.8% Confidence',
          status: 'optimal'
        }
      };
    }

    if (userPrompt.includes('SHAP') || userPrompt.includes('feature importance')) {
      return {
        text: `**Explainable AI (XAI / SHAP) Decomposition:**\n\nTop contributing features to the current risk score:\n\n1. **Feature #1 (Telemetry Ingress Volatility):** +0.42 SHAP value (primary upward driver).\n2. **Feature #2 (Historical Incident MTBF):** -0.28 SHAP value (stabilizing factor).\n3. **Feature #3 (Staffing / Operator Shift Fatigue):** +0.14 SHAP value.\n4. **Feature #4 (Environmental & Network Latency):** -0.11 SHAP value.`,
        actionCard: {
          title: 'Model Interpretability Check',
          description: 'SHAP TreeExplainer confirms zero anomalous biases in risk attribution weights.',
          metric: 'Shapley R2: 0.992',
          status: 'optimal'
        }
      };
    }

    // Default intelligent response
    return {
      text: `Understood. Analyzing query through the cognitive reasoning engine for **${orgName}**...\n\nBased on real-time cross-departmental correlation between ${currentOrg?.departments.slice(0, 3).join(', ')}, all parameters remain stabilized. Automated diagnostic pipelines confirm zero critical drift, and automated incident response remains on standby.`,
      actionCard: {
        title: 'Query Telemetry Processed',
        description: `Evaluated against ${currentOrg?.statValue} telemetry datapoints.`,
        status: 'optimal'
      }
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const newUserMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsThinking(true);

    setTimeout(() => {
      const response = generateAIResponse(text);
      const newAIMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionCard: response.actionCard
      };
      setMessages(prev => [...prev, newAIMessage]);
      setIsThinking(false);
    }, 700);
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
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Sparkles size={16} color="#FFFFFF" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '0.5px' }}>
                IPRAP Copilot
              </span>
              <span style={{ fontSize: '0.65rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                AI Assistant Online
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
                width: '38px', height: '38px', borderRadius: '12px',
                background: 'var(--primary-gradient)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 15px rgba(var(--primary-rgb), 0.4)'
              }}>
                <Bot size={22} color="#FFFFFF" />
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  IPRAP AI Copilot <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600', textTransform: 'capitalize' }}>
                  {currentOrg?.name} &bull; {currentRole?.title || role}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 1rem', background: 'var(--bg-secondary)', borderRadius: '14px', alignSelf: 'flex-start', border: '1px solid var(--border-color)' }}>
                <RefreshCw size={16} className="animate-spin text-gradient" />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Neural inference in progress...</span>
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
              placeholder={`Ask AI Copilot about ${currentOrg?.name || 'risks'}...`}
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
