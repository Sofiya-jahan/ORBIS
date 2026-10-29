import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { ORGANIZATIONS } from '../../config/platformConfig';
import { formatUserName } from '../../utils/userUtils';
import { renderFormattedMessage } from '../../utils/messageFormatter';
import { queryNemotron } from '../../services/nvidiaNemotronService';
import { 
  Sparkles, Brain, TrendingUp, Cpu, Bot, 
  Layers, CheckCircle2, AlertTriangle, ArrowUpRight, 
  Sliders, RefreshCw, Send, Zap, SlidersHorizontal, 
  HelpCircle, ShieldCheck, Activity, Terminal
} from 'lucide-react';

// Reuse existing AI components
import PredictiveAI from './PredictiveAI';
import ExplainableAI from './ExplainableAI';
import { OrganizationalPortalBackdrop } from '../../components/OrganizationalPortalBackdrop';

export const AIIntelligence = () => {
  const { organization, role, user, theme } = useAuthStore();
  const isLight = theme === 'light';
  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : ORGANIZATIONS.hospital;
  const currentRole = currentOrg?.roles.find(r => r.id === role) || currentOrg?.roles[0];
  const cleanDisplayName = formatUserName(user?.name, user?.email);
  const resolvedRoleTitle = currentRole?.title || 'Officer';
  const greetingText = `Greetings **${cleanDisplayName}**. Welcome to **${currentOrg.name}** for your role as **${resolvedRoleTitle}**.\n\nHow can I assist you today?`;

  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'overview';
  const setTab = (tab: string) => {
    setSearchParams({ tab });
  };

  // Scenario Simulator State
  const [selectedScenario, setSelectedScenario] = useState<string>('cyber');
  const [scenarioIntensity, setScenarioIntensity] = useState<number>(75);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Embedded Copilot Chat state
  const [messages, setMessages] = useState<{ id: string; sender: 'user' | 'assistant'; text: string; time: string }[]>([
    {
      id: '1',
      sender: 'assistant',
      text: greetingText,
      time: 'Just now'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Synchronize greeting whenever user changes organization or role
  useEffect(() => {
    setMessages(prev => {
      if (prev.length <= 1 || prev[0]?.text.startsWith('Greetings')) {
        return [
          {
            id: '1',
            sender: 'assistant',
            text: greetingText,
            time: 'Just now'
          },
          ...prev.slice(1)
        ];
      }
      return prev;
    });
  }, [organization, role, cleanDisplayName, resolvedRoleTitle, greetingText]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userMsg = inputMessage;
    const newMsg = {
      id: Date.now().toString(),
      sender: 'user' as const,
      text: userMsg,
      time: 'Just now'
    };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsTyping(true);

    try {
      const nemotronResult = await queryNemotron(
        userMsg,
        {
          organization: currentOrg,
          roleTitle: currentRole?.title,
          accessLevel: currentRole?.accessLevel,
          userName: cleanDisplayName,
          activeModules: currentOrg?.industryModules?.map(m => m.name),
          healthScore: currentOrg?.healthScore,
          aiRiskScore: currentOrg?.aiRiskScore
        },
        updatedMessages.map(m => ({
          id: m.id,
          sender: m.sender === 'user' ? 'user' : 'ai',
          text: m.text,
          timestamp: m.time
        }))
      );

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: nemotronResult.text,
        time: 'Just now'
      }]);
    } catch (err) {
      console.error('Error querying AI:', err);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: `Based on current organizational telemetry, systemic risk for ${currentOrg.name} is measured at ${currentOrg.aiRiskScore}%. Containment protocols active.`,
        time: 'Just now'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Brain },
    { id: 'predictions', label: 'Predictions & Forecasting', icon: TrendingUp },
    { id: 'copilot', label: 'AI Copilot Workspace', icon: Bot },
    { id: 'explainability', label: 'Explainability (XAI)', icon: Cpu },
    { id: 'recommendations', label: 'Autonomous Actions', icon: Sparkles },
    { id: 'simulator', label: 'Scenario Simulator', icon: Sliders }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Page Header */}
      <OrganizationalPortalBackdrop
        themeColor={currentOrg.themeColor}
        secondaryColor={currentOrg.secondaryColor}
        accentColor={currentOrg.accentColor}
        nodeBadgeText="NEMOTRON REASONING ENGINE &bull; BAYESIAN INFERENCE CORE"
        variant="banner"
      >
        <div style={{
          padding: '2rem 2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#8671F9', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.4rem' }}>
              <Sparkles size={16} /> Autonomous Intelligence Core &bull; {currentOrg.name}
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.5px' }}>
              AI Intelligence & Reasoning Workspace
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0.4rem 0 0', maxWidth: '720px' }}>
              Unified cognitive environment housing predictive risk forecasting, SHAP explainable attribution, conversational Copilot inference, and stress-testing simulators.
            </p>
          </div>

          {/* Global Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button 
              onClick={() => setTab('copilot')}
              className="btn btn-ai"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 1.4rem', fontSize: '0.88rem' }}
            >
              <Bot size={16} /> Launch Copilot Chat
            </button>
            <button 
              onClick={() => setTab('simulator')}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 1.25rem', fontSize: '0.88rem' }}
            >
              <Sliders size={16} /> Run Stress Test
            </button>
          </div>
        </div>
      </OrganizationalPortalBackdrop>

      {/* Primary AI Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '18px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Neural Model Trust</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#8671F9', fontFamily: "'JetBrains Mono', monospace" }}>94.8%</div>
          <div style={{ fontSize: '0.8rem', color: '#6AE7F7', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.25rem' }}>
            <ShieldCheck size={14} /> FIPS & NIST Calibrated
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '18px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Inference Latency</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#2E9BF8', fontFamily: "'JetBrains Mono', monospace" }}>142ms</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            NVIDIA Nemotron-3 acceleration
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '18px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Bayesian Confidence</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#6AE7F7', fontFamily: "'JetBrains Mono', monospace" }}>98.4%</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Across 1,280 feature nodes
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '18px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Automated Mitigations</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>12 Active</div>
          <div style={{ fontSize: '0.8rem', color: '#6AE7F7', marginTop: '0.25rem' }}>
            0 human-intervention overrides
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        padding: '0.35rem',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        overflowX: 'auto'
      }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.75rem 1.25rem',
                borderRadius: '12px',
                border: 'none',
                background: isActive 
                  ? 'linear-gradient(135deg, #4148F1 0%, #7A48FF 100%)' 
                  : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                boxShadow: isActive ? '0 4px 15px rgba(122, 72, 255, 0.4)' : 'none'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Workspace based on Active Tab */}
      <div style={{ minHeight: '500px' }}>
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
              
              {/* Telemetry Stream Digest */}
              <div className="glass-card" style={{ padding: '2rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    Real-Time Inference Streams
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: currentOrg.accentColor, fontWeight: 700, background: `${currentOrg.accentColor}20`, padding: '2px 8px', borderRadius: '6px' }}>
                    1.8B EVENTS / DAY
                  </span>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  ORBIS continuous neural listener ingests real-time telemetry across infrastructure logs, financial ledgers, patient queues, and access tokens to calibrate risk probabilities every 60 seconds.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: isLight ? 'var(--bg-secondary)' : 'rgba(13, 35, 77, 0.5)', borderRadius: '12px', fontSize: '0.85rem', border: '1px solid var(--border-color)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Model Architecture</span>
                    <span style={{ color: '#8671F9', fontWeight: 800 }}>Nemotron-3 Deep Reasoning</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: isLight ? 'var(--bg-secondary)' : 'rgba(13, 35, 77, 0.5)', borderRadius: '12px', fontSize: '0.85rem', border: '1px solid var(--border-color)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Quantization Precision</span>
                    <span style={{ color: currentOrg.accentColor, fontWeight: 800 }}>FP16 Tensor Core</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: isLight ? 'var(--bg-secondary)' : 'rgba(13, 35, 77, 0.5)', borderRadius: '12px', fontSize: '0.85rem', border: '1px solid var(--border-color)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Active Context Window</span>
                    <span style={{ color: currentOrg.secondaryColor, fontWeight: 800 }}>128,000 Tokens</span>
                  </div>
                </div>

                <button
                  onClick={() => setTab('copilot')}
                  className="btn btn-ai"
                  style={{ width: '100%', marginTop: '1.5rem', padding: '0.8rem', fontSize: '0.88rem' }}
                >
                  Engage AI Copilot &rarr;
                </button>
              </div>

              {/* Stress Test Quick Trigger */}
              <div className="glass-card" style={{ padding: '2rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '20px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>
                  Scenario Stress-Testing Engine
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Simulate macroeconomic shocks, ransomware lockouts, and regulatory audit failure to observe how risk scores propagate through {currentOrg.name}.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {[
                    { id: 'cyber', name: 'Ransomware Attack', delta: '+34% Risk' },
                    { id: 'supply', name: 'Supply Transit Halt', delta: '+22% Risk' },
                    { id: 'liquidity', name: 'Liquidity Freeze', delta: '+28% Risk' },
                    { id: 'compliance', name: 'Audit Disallowance', delta: '+18% Risk' }
                  ].map(sc => (
                    <div 
                      key={sc.id}
                      onClick={() => { setSelectedScenario(sc.id); setTab('simulator'); }}
                      style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        background: isLight ? 'var(--bg-secondary)' : 'rgba(13, 35, 77, 0.6)',
                        border: '1px solid var(--border-color)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>{sc.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#EF4444', fontWeight: 700, marginTop: '2px' }}>{sc.delta}</div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setTab('simulator')}
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '0.8rem', fontSize: '0.88rem' }}
                >
                  Open Scenario Simulator &rarr;
                </button>
              </div>
            </div>

            {/* Predictive View Embedded */}
            <PredictiveAI />
          </div>
        )}

        {/* TAB 2: PREDICTIONS */}
        {activeTab === 'predictions' && (
          <div>
            <PredictiveAI />
          </div>
        )}

        {/* TAB 3: AI COPILOT INTERACTIVE CHAT */}
        {activeTab === 'copilot' && (
          <div className="glass-card" style={{
            padding: '2rem',
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            height: '700px',
            boxShadow: isLight ? 'var(--shadow-md)' : '0 20px 60px rgba(0, 0, 0, 0.6)'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #4148F1 0%, #7A48FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(122, 72, 255, 0.4)' }}>
                  <Bot size={22} color="#FFFFFF" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    ORBIS Risk Intelligence Copilot
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: currentOrg.accentColor, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: currentOrg.accentColor, boxShadow: `0 0 8px ${currentOrg.accentColor}` }} />
                    Active Enterprise Context &bull; {currentOrg.name} &bull; {resolvedRoleTitle}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setMessages([
                    {
                      id: '1',
                      sender: 'assistant',
                      text: greetingText,
                      time: 'Just now'
                    }
                  ])}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 0.9rem', fontSize: '0.78rem' }}
                >
                  <RefreshCw size={14} /> Clear History
                </button>
              </div>
            </div>

            {/* Message Stream */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.5rem 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}>
              {messages.map(msg => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    gap: '10px'
                  }}
                >
                  {msg.sender === 'assistant' && (
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `linear-gradient(135deg, ${currentOrg.themeColor} 0%, ${currentOrg.secondaryColor} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Sparkles size={16} color="#FFFFFF" />
                    </div>
                  )}

                  <div style={{
                    maxWidth: '75%',
                    padding: '1rem 1.35rem',
                    borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.sender === 'user'
                      ? `linear-gradient(135deg, ${currentOrg.themeColor} 0%, ${currentOrg.secondaryColor} 100%)`
                      : (isLight ? 'var(--bg-secondary)' : 'rgba(13, 35, 77, 0.75)'),
                    border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                    color: msg.sender === 'user' ? '#FFFFFF' : 'var(--text-primary)',
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                    boxShadow: isLight ? 'var(--shadow-sm)' : '0 8px 24px rgba(0, 0, 0, 0.3)'
                  }}>
                    {renderFormattedMessage(msg.text, msg.sender === 'user')}
                    <div style={{ fontSize: '0.68rem', color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)', marginTop: '6px', textAlign: 'right' }}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8671F9', fontSize: '0.85rem' }}>
                  <Sparkles size={16} className="animate-spin" />
                  <span>Synthesizing organizational intelligence...</span>
                </div>
              )}
            </div>

            {/* Suggested Prompts */}
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem' }}>
              {[
                'Show departments with highest operational risk',
                'Why did compliance decrease?',
                'Generate executive summary',
                'Summarize incidents this month',
                'Predict next month\'s organizational health',
                'Suggest mitigation priorities'
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setInputMessage(prompt)}
                  style={{
                    background: isLight ? 'var(--bg-secondary)' : 'rgba(13, 35, 77, 0.6)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '999px',
                    padding: '0.4rem 0.9rem',
                    color: currentOrg.accentColor,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <input
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder={`Ask ORBIS Copilot about ${currentOrg.name} risk telemetry...`}
                style={{
                  flex: 1,
                  padding: '0.9rem 1.25rem',
                  borderRadius: '14px',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                className="btn btn-ai"
                disabled={isTyping}
                style={{ padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem' }}
              >
                <span>Send</span>
                <Send size={16} />
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: EXPLAINABILITY */}
        {activeTab === 'explainability' && (
          <div>
            <ExplainableAI />
          </div>
        )}

        {/* TAB 5: RECOMMENDATIONS */}
        {activeTab === 'recommendations' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>
              Autonomous Neural Mitigations & Policy Directives
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '0 0 2rem' }}>
              AI-generated operational recommendations with automated single-click execution, compliance sign-offs, and estimated risk reductions.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { title: `Rebalance Load Allocation across ${currentOrg.departments[0]} & ${currentOrg.departments[1] || 'Core'}`, delta: '-4.8% Systemic Risk', urgency: 'Immediate', confidence: '98.7%', action: 'Apply Load Redistribution' },
                { title: 'Enforce Automated 8-Hour Session Expiry on High-Privilege Roles', delta: '-3.2% Attack Surface', urgency: 'Recommended', confidence: '99.1%', action: 'Enforce Key Policy' },
                { title: 'Quarantine Suspicious MIME Uploads Exceeding 10MB Ingress', delta: '-2.5% Vulnerability Delta', urgency: 'Pre-emptive', confidence: '96.4%', action: 'Activate Attachment Sieve' }
              ].map((rec, idx) => (
                <div key={idx} style={{
                  padding: '1.75rem',
                  borderRadius: '18px',
                  background: 'rgba(13, 35, 77, 0.45)',
                  border: '1px solid rgba(122, 72, 255, 0.25)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1.5rem'
                }}>
                  <div style={{ maxWidth: '620px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8671F9', background: 'rgba(122, 72, 255, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                        {rec.urgency}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#6AE7F7', fontWeight: 700 }}>
                        {rec.delta}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(246, 253, 255, 0.55)' }}>
                        &bull; Confidence {rec.confidence}
                      </span>
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F6FDFF' }}>
                      {rec.title}
                    </div>
                  </div>

                  <button 
                    onClick={() => alert(`Autonomous Action executed: ${rec.action}`)}
                    className="btn btn-primary"
                    style={{ padding: '0.85rem 1.5rem', fontSize: '0.88rem' }}
                  >
                    {rec.action} &rarr;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SCENARIO SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: 'rgba(7, 17, 46, 0.92)', border: '1px solid rgba(46, 155, 248, 0.25)', borderRadius: '24px' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F6FDFF', margin: '0 0 0.5rem' }}>
                Macro & Operational Scenario Stress Simulator
              </h2>
              <p style={{ color: 'rgba(246, 253, 255, 0.75)', fontSize: '0.92rem', margin: 0 }}>
                Simulate catastrophic systemic failures to model resilience thresholds and dynamic organizational recovery trajectories.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {[
                { id: 'cyber', name: 'Ransomware & Zero-Day Breach', base: 34, impact: 'Critical Infrastructure Outage' },
                { id: 'supply', name: 'Global Supply Disruption', base: 22, impact: 'Inventory & Latency Spikes' },
                { id: 'liquidity', name: 'Macroeconomic Liquidity Shock', base: 28, impact: 'Capital & Operating Reserves Depletion' },
                { id: 'compliance', name: 'Regulatory Sanctions & Audit Freeze', base: 19, impact: 'Licensing & Reputational Penalty' }
              ].map(item => (
                <div
                  key={item.id}
                  onClick={() => setSelectedScenario(item.id)}
                  style={{
                    padding: '1.5rem',
                    borderRadius: '16px',
                    background: selectedScenario === item.id ? 'rgba(21, 84, 232, 0.25)' : 'rgba(13, 35, 77, 0.45)',
                    border: selectedScenario === item.id ? '2px solid #2E9BF8' : '1px solid rgba(46, 155, 248, 0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#F6FDFF', marginBottom: '0.4rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(246, 253, 255, 0.65)' }}>{item.impact}</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#EF4444', marginTop: '0.75rem' }}>
                    Baseline Impact: +{item.base}% Risk
                  </div>
                </div>
              ))}
            </div>

            {/* Slider */}
            <div style={{ background: 'rgba(13, 35, 77, 0.5)', padding: '1.75rem', borderRadius: '18px', border: '1px solid rgba(46, 155, 248, 0.2)', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#F6FDFF' }}>Scenario Severity Intensity</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#6AE7F7', fontFamily: "'JetBrains Mono', monospace" }}>{scenarioIntensity}% Intensity</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={scenarioIntensity}
                onChange={e => setScenarioIntensity(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#2E9BF8', cursor: 'pointer' }}
              />
            </div>

            {/* Simulation Result */}
            <div style={{
              padding: '2rem',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(7, 17, 46, 0.95) 0%, rgba(13, 35, 77, 0.9) 100%)',
              border: '2px solid #6AE7F7',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
              boxShadow: '0 10px 30px rgba(106, 231, 247, 0.15)'
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#6AE7F7', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
                  Simulated Resilience Projection
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#F6FDFF', fontFamily: "'JetBrains Mono', monospace" }}>
                  Systemic Risk Delta: +{Math.round(20 * (scenarioIntensity / 50))}% &bull; Estimated Recovery: 4.2 Hours
                </div>
                <div style={{ fontSize: '0.88rem', color: 'rgba(246, 253, 255, 0.75)', marginTop: '0.25rem' }}>
                  Autonomous failover will absorb 72% of shock without SLA degradation for {currentOrg.name}.
                </div>
              </div>

              <button
                onClick={() => {
                  setIsSimulating(true);
                  setTimeout(() => {
                    setIsSimulating(false);
                    alert('Scenario simulation completed. Telemetry buffers reset.');
                  }, 800);
                }}
                className="btn btn-primary"
                style={{ padding: '0.9rem 1.8rem', fontSize: '0.92rem' }}
              >
                {isSimulating ? 'Simulating Dynamic Load...' : 'Run Monte-Carlo Run (1,000 Iterations)'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AIIntelligence;
