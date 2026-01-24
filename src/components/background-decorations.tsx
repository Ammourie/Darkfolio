import React from 'react';
import { Braces, Code2, Cpu, Database, GitBranch, Terminal } from 'lucide-react';

export function BackgroundDecorations() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-grid-soft opacity-40" />

      {/* Soft gradient “orbs” for depth */}
      <div className="absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-primary/25 blur-3xl opacity-40 animate-glow-slow" />
      <div className="absolute top-[18%] -right-40 h-[30rem] w-[30rem] rounded-full bg-secondary/20 blur-3xl opacity-35 animate-glow-slow" />
      <div className="absolute -bottom-48 left-[20%] h-[32rem] w-[32rem] rounded-full bg-accent/20 blur-3xl opacity-35 animate-glow-slow" />

      {/* Floating coding icons */}
      <Code2 className="absolute top-[14%] left-[12%] h-10 w-10 text-primary/15 blur-[0.3px] animate-float-slow" />
      <Terminal className="absolute top-[28%] right-[14%] h-12 w-12 text-accent/15 blur-[0.3px] animate-float-slower" />
      <Braces className="absolute bottom-[18%] left-[10%] h-11 w-11 text-secondary/15 blur-[0.3px] animate-float-x-slow" />
      <GitBranch className="absolute bottom-[22%] right-[18%] h-10 w-10 text-primary/15 blur-[0.3px] animate-float-slow" />
      <Cpu className="absolute top-[55%] left-[22%] h-9 w-9 text-accent/15 blur-[0.3px] animate-float-slower" />
      <Database className="absolute top-[62%] right-[26%] h-10 w-10 text-secondary/15 blur-[0.3px] animate-float-x-slow" />

      <div className="absolute top-[10%] left-[5%] text-primary/5 text-9xl font-code -translate-x-1/2 -translate-y-1/2 rotate-12">
        {'</>'}
      </div>
      <div className="absolute bottom-[10%] right-[5%] text-accent/5 text-9xl font-code translate-x-1/2 translate-y-1/2 -rotate-12">
        {'{...}'}
      </div>
      <div className="absolute top-[5%] right-[20%] text-primary/5 text-8xl font-code rotate-[25deg]">
        {'()=>'}
      </div>
      <div className="absolute bottom-[15%] left-[25%] text-accent/5 text-8xl font-code rotate-[-35deg]">
        {'useEffect'}
      </div>
    </div>
  );
}
