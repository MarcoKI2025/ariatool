import React, { useState, useEffect, useRef } from 'react';

const LOG_TEMPLATES = [
  '[SCAN] Analyzing Sub-Agent delegation chain... [OK]',
  '[SYNC] Provider health check: AWS us-east-1... [OPERATIONAL]',
  '[SCAN] Quantum-drift monitor: PQC readiness... [STABLE]',
  '[AUDIT] Evidence log integrity verified... [PASS]',
  '[SYNC] Model governance version check... [CURRENT]',
  '[SCAN] Agentic authority escalation check... [CLEAR]',
  '[SYNC] Provider health check: GCP europe-west1... [OPERATIONAL]',
  '[SCAN] Hallucination rate monitor... [WITHIN THRESHOLD]',
  '[AUDIT] Delegation depth analysis... [COMPLETE]',
  '[SYNC] Portfolio correlation scan... [UPDATED]',
  '[SCAN] Bias variance detector: protected groups... [CLEAR]',
  '[SYNC] Provider health check: Azure westeurope... [OPERATIONAL]',
  '[SCAN] Continuation density monitor... [STABLE]',
  '[AUDIT] Reversibility cost assessment... [LOGGED]',
  '[SYNC] Cloud concentration index... [RECALCULATED]',
  '[SCAN] Model drift detector: baseline check... [OK]',
  '[AUDIT] Regulatory alignment: EU AI Act Art. 13... [MAPPED]',
  '[SYNC] Live feed heartbeat... [ACTIVE]',
];

export function LiveRiskFeed() {
  const [logs, setLogs] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add initial logs
    const initial = Array.from({ length: 4 }, () =>
      LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)]
    );
    setLogs(initial);

    // Add new log every 3-6 seconds
    const interval = setInterval(() => {
      const newLog = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
      setLogs(prev => [...prev.slice(-12), newLog]);
    }, 3000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="px-3 py-2">
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-1.5 h-1.5 rounded-full bg-stable animate-pulse" />
        <span className="text-[8px] font-bold tracking-[0.1em] uppercase text-muted-foreground">
          Live Risk Feed (DEMO)
        </span>
      </div>
      <div
        ref={containerRef}
        className="h-[100px] overflow-y-auto rounded-md bg-[hsl(220,16%,8%)] p-2 font-mono text-[8px] leading-[1.7] space-y-0.5 scrollbar-thin"
      >
        {logs.map((log, i) => {
          const isOk = log.includes('[OK]') || log.includes('[OPERATIONAL]') || log.includes('[STABLE]') || log.includes('[PASS]') || log.includes('[CLEAR]') || log.includes('[CURRENT]') || log.includes('[ACTIVE]');
          const isAction = log.includes('[SCAN]');
          const isSync = log.includes('[SYNC]');
          return (
            <div key={i} className={`${
              isOk ? 'text-[hsl(152,55%,50%)]' :
              isAction ? 'text-[hsl(38,70%,60%)]' :
              isSync ? 'text-[hsl(210,55%,60%)]' :
              'text-[hsl(220,6%,50%)]'
            } ${i === logs.length - 1 ? 'opacity-100' : 'opacity-70'}`}>
              <span className="text-[hsl(220,6%,35%)] mr-1">
                {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              {log}
            </div>
          );
        })}
      </div>
    </div>
  );
}
