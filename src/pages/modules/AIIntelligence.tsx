import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { ORGANIZATIONS } from '../../config/platformConfig';
import { 
  Sparkles, Brain, TrendingUp, Cpu, Bot, 
  Layers, CheckCircle2, AlertTriangle, ArrowUpRight, 
  Sliders, RefreshCw, Send, Zap, SlidersHorizontal, 
  HelpCircle, ShieldCheck, Activity, Terminal
} from 'lucide-react';

// Reuse existing AI components
import PredictiveAI from './PredictiveAI';
import ExplainableAI from './ExplainableAI';

export const AIIntelligence = () => {
  const { organization, user } = useAuthStore();
  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : ORGANIZATIONS.hospital;
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
      text: `Hello ${user?.name || 'Executive'}. I am the ORBIS Neural Reasoning Copilot. I have synthesized telemetry from all ${currentOrg.departments.length} departments. How can I assist your organizational risk management today?`,
      time: 'Just now'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userMsg = inputMessage;
    const newMsg = {
      id: Date.now().toString(),
      sender: 'user' as const,
      text: userMsg,
      time: 'Just now'
    };
    setMessages(prev => [...prev, newMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = `Based on current 24-hour predictive trajectory, systemic risk for ${currentOrg.name} is measured at 14.2% (Nominal). All priority containment protocols remain within ISO 31000 parameters.`;
      if (userMsg.toLowerCase().includes('recommend') || userMsg.toLowerCase().includes('action')) {
        reply = `Top Neural Recommendation: Rebalance workload allocations in ${currentOrg.departments[0]} and apply the cryptographic session key rotation. This yields an estimated -4.1% risk reduction.`;
      } else if (userMsg.toLowerCase().includes('critical') || userMsg.toLowerCase().includes('alert')) {
        reply = `There are currently 2 active risks under critical monitoring. Neither has caused SLA degradation. Automated mitigation MP-021 has already been triggered.`;
      }
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: reply,
        time: 'Just now'
      }]);
      setIsTyping(false);
    }, 900);
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
      <div className="glass-card" style={{
        padding: '2rem 2.5rem',
        background: 'rgba(7, 17, 46, 0.92)',
        border: '1px solid rgba(122, 72, 255, 0.28)',
        borderRadius: '24px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(122, 72, 255, 0.15)',
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
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#F6FDFF', margin: 0, letterSpacing: '-0.5px' }}>
            AI Intelligence & Reasoning Workspace
          </h1>
          <p style={{ color: 'rgba(246, 253, 255, 0.75)', fontSize: '0.95rem', margin: '0.4rem 0 0', maxWidth: '720px' }}>
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

      {/* Primary AI Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(7, 17, 46, 0.88)', border: '1px solid rgba(134, 113, 249, 0.25)', borderRadius: '18px' }}>
          <div style={{ color: 'rgba(246, 253, 255, 0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Neural Model Trust</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#8671F9', fontFamily: "'JetBrains Mono', monospace" }}>94.8%</div>
          <div style={{ fontSize: '0.8rem', color: '#6AE7F7', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.25rem' }}>
            <ShieldCheck size={14} /> FIPS & NIST Calibrated
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(7, 17, 46, 0.88)', border: '1px solid rgba(46, 155, 248, 0.2)', borderRadius: '18px' }}>
          <div style={{ color: 'rgba(246, 253, 255, 0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Inference Latency</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#2E9BF8', fontFamily: "'JetBrains Mono', monospace" }}>142ms</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(246, 253, 255, 0.75)', marginTop: '0.25rem' }}>
            NVIDIA Nemotron-3 acceleration
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(7, 17, 46, 0.88)', border: '1px solid rgba(106, 231, 247, 0.25)', borderRadius: '18px' }}>
          <div style={{ color: 'rgba(246, 253, 255, 0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Bayesian Confidence</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#6AE7F7', fontFamily: "'JetBrains Mono', monospace" }}>98.4%</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(246, 253, 255, 0.75)', marginTop: '0.25rem' }}>
            Across 1,280 feature nodes
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(7, 17, 46, 0.88)', border: '1px solid rgba(46, 155, 248, 0.2)', borderRadius: '18px' }}>
          <div style={{ color: 'rgba(246, 253, 255, 0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Automated Mitigations</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#F6FDFF', fontFamily: "'JetBrains Mono', monospace" }}>12 Active</div>
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
        background: 'rgba(7, 17, 46, 0.95)',
        border: '1px solid rgba(122, 72, 255, 0.25)',
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
                color: isActive ? '#F6FDFF' : 'rgba(246, 253, 255, 0.7)',
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
              <div className="glass-card" style={{ padding: '2rem', background: 'rgba(7, 17, 46, 0.9)', border: '1px solid rgba(46, 155, 248, 0.22)', borderRadius: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F6FDFF', margin: 0 }}>
                    Real-Time Inference Streams
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#6AE7F7', fontWeight: 700, background: 'rgba(106, 231, 247, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                    1.8B EVENTS / DAY
                  </span>
                </div>

                <p style={{ color: 'rgba(246, 253, 255, 0.75)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  ORBIS continuous neural listener ingests real-time telemetry across infrastructure logs, financial ledgers, patient queues, and access tokens to calibrate risk probabilities every 60 seconds.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(13, 35, 77, 0.5)', borderRadius: '12px', fontSize: '0.85rem' }}>
                    <span style={{ color: 'rgba(246, 253, 255, 0.75)' }}>Model Architecture</span>
                    <span style={{ color: '#8671F9', fontWeight: 800 }}>Nemotron-3 Deep Reasoning</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(13, 35, 77, 0.5)', borderRadius: '12px', fontSize: '0.85rem' }}>
                    <span style={{ color: 'rgba(246, 253, 255, 0.75)' }}>Quantization Precision</span>
                    <span style={{ color: '#6AE7F7', fontWeight: 800 }}>FP16 Tensor Core</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(13, 35, 77, 0.5)', borderRadius: '12px', fontSize: '0.85rem' }}>
                    <span style={{ color: 'rgba(246, 253, 255, 0.75)' }}>Active Context Window</span>
                    <span style={{ color: '#2E9BF8', fontWeight: 800 }}>128,000 Tokens</span>
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
              <div className="glass-card" style={{ padding: '2rem', background: 'rgba(7, 17, 46, 0.9)', border: '1px solid rgba(134, 113, 249, 0.25)', borderRadius: '20px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F6FDFF', margin: '0 0 0.5rem' }}>
                  Scenario Stress-Testing Engine
                </h3>
                <p style={{ color: 'rgba(246, 253, 255, 0.75)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
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
                        background: 'rgba(13, 35, 77, 0.6)',
                        border: '1px solid rgba(46, 155, 248, 0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#F6FDFF' }}>{sc.name}</div>
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
            background: 'rgba(7, 17, 46, 0.94)',
            border: '1px solid rgba(122, 72, 255, 0.3)',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            height: '700px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(46, 155, 248, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #4148F1 0%, #7A48FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(122, 72, 255, 0.4)' }}>
                  <Bot size={22} color="#F6FDFF" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F6FDFF', margin: 0 }}>
                    ORBIS Neural Copilot &bull; NVIDIA Nemotron-3
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#6AE7F7', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6AE7F7', boxShadow: '0 0 8px #6AE7F7' }} />
                    Active Enterprise Context &bull; {currentOrg.name} Telemetry Linked
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setMessages([
                    {
                      id: '1',
                      sender: 'assistant',
                      text: `Conversation memory refreshed. How can I assist you with ${currentOrg.name} operational intelligence?`,
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
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #1554E8 0%, #2E9BF8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Sparkles size={16} color="#F6FDFF" />
                    </div>
                  )}

                  <div style={{
                    maxWidth: '75%',
                    padding: '1rem 1.35rem',
                    borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.sender === 'user'
                      ? 'linear-gradient(135deg, #1554E8 0%, #2E9BF8 100%)'
                      : 'rgba(13, 35, 77, 0.75)',
                    border: msg.sender === 'user' ? 'none' : '1px solid rgba(46, 155, 248, 0.25)',
                    color: '#F6FDFF',
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                  }}>
                    {msg.text}
                    <div style={{ fontSize: '0.68rem', color: 'rgba(246, 253, 255, 0.55)', marginTop: '6px', textAlign: 'right' }}>
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
                'Analyze systemic risk trend',
                'What are our top critical vulnerabilities?',
                'Generate board-ready risk summary',
                'Recommend mitigation plan'
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setInputMessage(prompt)}
                  style={{
                    background: 'rgba(13, 35, 77, 0.6)',
                    border: '1px solid rgba(46, 155, 248, 0.25)',
                    borderRadius: '999px',
                    padding: '0.4rem 0.9rem',
                    color: '#6AE7F7',
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
                  background: 'rgba(7, 17, 46, 0.9)',
                  border: '1px solid rgba(46, 155, 248, 0.35)',
                  color: '#F6FDFF',
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
          <div className="glass-card" style={{ padding: '2.5rem', background: 'rgba(7, 17, 46, 0.92)', border: '1px solid rgba(122, 72, 255, 0.28)', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F6FDFF', margin: '0 0 0.5rem' }}>
              Autonomous Neural Mitigations & Policy Directives
            </h2>
            <p style={{ color: 'rgba(246, 253, 255, 0.75)', fontSize: '0.92rem', margin: '0 0 2rem' }}>
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
