"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal, RefreshCw, Eye, EyeOff, Shield } from "lucide-react";

interface LogEntry {
  timestamp: string;
  category: "SYSTEM" | "CMS" | "LEADS";
  message: string;
  level: "INFO" | "SUCCESS" | "WARN" | "ERROR";
}

type LogCategory = LogEntry["category"];
type LogLevel = LogEntry["level"];

interface MockMessage {
  category: LogCategory;
  message: string;
  level: LogLevel;
}

const INITIAL_LOGS: LogEntry[] = [
  { timestamp: "16:53:10", category: "SYSTEM", message: "Starting Fluxion server environment...", level: "INFO" },
  { timestamp: "16:53:11", category: "SYSTEM", message: "Docker daemon connection established.", level: "SUCCESS" },
  { timestamp: "16:53:12", category: "SYSTEM", message: "Database pool connected. Client ready.", level: "INFO" },
  { timestamp: "16:53:15", category: "CMS", message: "Loaded site-content.json structure successfully.", level: "SUCCESS" },
  { timestamp: "16:53:20", category: "SYSTEM", message: "Next.js dev server listening on http://localhost:3000", level: "INFO" },
  { timestamp: "16:53:40", category: "SYSTEM", message: "Webpack compiler successfully compiled page /admin", level: "SUCCESS" },
  { timestamp: "16:54:02", category: "LEADS", message: "Read check executed on leads.json. Found 0 records.", level: "INFO" },
  { timestamp: "16:54:12", category: "CMS", message: "Admin authenticated via session token.", level: "SUCCESS" },
  { timestamp: "16:55:01", category: "SYSTEM", message: "Memory usage telemetry: heapUsed=48MB, heapTotal=82MB", level: "INFO" },
];

const MOCK_MESSAGES: MockMessage[] = [
  { category: "SYSTEM", message: "API endpoint latency telemetry ping: Vercel CDN -> Kinshasa (21ms)", level: "INFO" },
  { category: "SYSTEM", message: "Prisma client heartbeat check OK.", level: "SUCCESS" },
  { category: "LEADS", message: "New contact lead submission processed. Dispatched email notification to contact@fluxion.cd", level: "SUCCESS" },
  { category: "CMS", message: "Successfully updated team configuration in site-content.json", level: "SUCCESS" },
  { category: "CMS", message: "Revalidated static path: /client/page", level: "INFO" },
  { category: "SYSTEM", message: "Garbage collection completed. Liberated 12.4 MB heap.", level: "INFO" },
  { category: "SYSTEM", message: "Warning: High network latency detected between edge server and database node.", level: "WARN" },
  { category: "LEADS", message: "Lead status changed: lead-x82739 -> 'contacted'", level: "INFO" },
  { category: "SYSTEM", message: "Prisma Query: SELECT * FROM `team` LIMIT 6 - Executed in 3.1ms", level: "INFO" },
  { category: "SYSTEM", message: "Security Audit: Verified access keys checksum verification passed.", level: "SUCCESS" },
];

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [filter, setFilter] = useState<"ALL" | "SYSTEM" | "CMS" | "LEADS">("ALL");
  const [isLive, setIsLive] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Live log simulation
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const randomMsg = MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      
      const newLog: LogEntry = {
        timestamp: timeStr,
        category: randomMsg.category,
        message: randomMsg.message,
        level: randomMsg.level,
      };
      
      setLogs((prev) => [...prev, newLog]);
    }, 4500);

    return () => clearInterval(interval);
  }, [isLive]);

  const filteredLogs = logs.filter(log => {
    if (filter === "ALL") return true;
    return log.category === filter;
  });

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="text-fluxion-pink-neon" size={20} />
            <h1 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight">
              LOGS DU FLUX
            </h1>
          </div>
          <p className="text-slate-500 text-xs mt-1.5 font-inter">
            Flux de télémétrie système, actions du CMS et leads entrants en temps réel.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold tracking-wider uppercase flex items-center gap-2 transition-all duration-300 ${
              isLive 
                ? "bg-fluxion-pink-neon/10 border-fluxion-pink-neon/30 text-fluxion-pink-neon" 
                : "bg-slate-100 border-slate-200 text-slate-500"
            }`}
          >
            {isLive ? <Eye size={12} /> : <EyeOff size={12} />}
            {isLive ? "Live Stream" : "Pause Stream"}
          </button>
          <button
            onClick={clearLogs}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw size={12} />
            Effacer
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-4">
        {(["ALL", "SYSTEM", "CMS", "LEADS"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all duration-300 border ${
              filter === tab
                ? "bg-slate-900 text-white border-slate-900"
                : "text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-100"
            }`}
          >
            {tab === "ALL" ? "TOUT" : tab}
          </button>
        ))}
      </div>

      {/* Console Output */}
      <div 
        ref={scrollRef}
        className="h-[550px] w-full rounded-xl border border-slate-200 bg-white shadow-sm p-6 font-mono text-[11px] overflow-y-auto space-y-2 select-text scrollbar-thin scrollbar-thumb-slate-200"
      >
        {filteredLogs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400">
            Aucun log à afficher.
          </div>
        ) : (
          filteredLogs.map((log, index) => {
            let color = "text-slate-600";
            if (log.level === "SUCCESS") color = "text-emerald-600";
            if (log.level === "WARN") color = "text-amber-600";
            if (log.level === "ERROR") color = "text-red-600";

            let catColor = "bg-slate-100 text-slate-500 border border-slate-200";
            if (log.category === "SYSTEM") catColor = "bg-[#343D91]/10 text-[#343D91] border border-[#343D91]/20";
            if (log.category === "CMS") catColor = "bg-purple-100 text-purple-700 border border-purple-200";
            if (log.category === "LEADS") catColor = "bg-pink-100 text-[#FF007F] border border-pink-200";

            return (
              <div 
                key={index} 
                className="flex items-start gap-4 hover:bg-slate-50 py-1.5 px-2 rounded transition-colors group animate-in slide-in-from-bottom-1 duration-300"
              >
                <span className="text-slate-400 font-bold select-none">{log.timestamp}</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-inter tracking-wider ${catColor}`}>
                  {log.category}
                </span>
                <span className={`flex-1 ${color} leading-relaxed font-medium`}>
                  {log.message}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Diagnostics summary footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="border border-slate-200 bg-white shadow-sm p-6 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-fluxion-pink-neon">
            <Terminal size={18} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-inter">Total Logs capturés</p>
            <p className="text-lg font-heading font-black text-slate-900 mt-0.5">{logs.length}</p>
          </div>
        </div>
        
        <div className="border border-slate-200 bg-white shadow-sm p-6 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-[#343D91]">
            <Shield size={18} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-inter">Niveau de sécurité</p>
            <p className="text-lg font-heading font-black text-slate-900 mt-0.5">COMPLIANT</p>
          </div>
        </div>

        <div className="border border-slate-200 bg-white shadow-sm p-6 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-emerald-500">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </div>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-inter">Flux Vercel Edge</p>
            <p className="text-lg font-heading font-black text-slate-900 mt-0.5">CONNECTÉ</p>
          </div>
        </div>
      </div>

    </div>
  );
}
