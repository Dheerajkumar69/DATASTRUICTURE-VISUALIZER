import React, { useEffect, useState, lazy, Suspense } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaPlay, FaPause, FaUndo, FaStepForward, FaStepBackward, FaRandom } from 'react-icons/fa';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const SyntaxHighlighter = lazy(() => import('react-syntax-highlighter'));

const PageContainer = styled.div`display:flex; flex-direction:column; padding:2rem; height:100%; overflow-y:auto;`;
const NavigationRow = styled.div`display:flex; align-items:center; margin-bottom:1.5rem;`;
const BackButton = styled(Link)`display:flex; align-items:center; color:${p=>p.theme.colors.primary}; font-weight:500; text-decoration:none; margin-right:1rem; svg{margin-right:.5rem}`;
const PageHeader = styled.div`margin-bottom:2rem;`;
const PageTitle = styled.h1`font-size:2rem; margin-bottom:.5rem; color:${p=>p.theme.colors.text};`;
const Description = styled.p`font-size:1rem; color:${p=>p.theme.colors.textLight}; max-width:800px; line-height:1.6; margin-bottom:2rem;`;
const ControlsContainer = styled.div`display:grid; grid-template-columns: repeat(auto-fit, minmax(120px,1fr)); gap:1rem; margin-bottom:2rem; max-width:800px;`;
const Button = styled.button`display:flex; align-items:center; justify-content:center; padding:.75rem 1rem; background:${p=>p.theme.colors.card}; color:${p=>p.theme.colors.text}; border:1px solid ${p=>p.theme.colors.border}; border-radius:.5rem; cursor:pointer; font-weight:500; transition:.2s; svg{margin-right:.5rem} &:hover{background:${p=>p.theme.colors.hover}} &:disabled{opacity:.5; cursor:not-allowed}`;
const InfoPanel = styled.div`padding:1rem; background:${p=>p.theme.colors.card}; border-radius:.5rem; border:1px solid ${p=>p.theme.colors.border}; margin-bottom:2rem; max-width:800px; width:100%;`;
const InfoTitle = styled.h3`margin-bottom:.5rem; color:${p=>p.theme.colors.text}; font-size:1.1rem;`;
const InfoText = styled.p`color:${p=>p.theme.colors.textLight}; margin-bottom:.5rem; line-height:1.5; font-size:.9rem;`;
const CodeContainer = styled.div`max-width:800px; border-radius:.5rem; overflow:hidden; margin-top:1rem; width:100%;`;

interface Step { description:string; parent:number[]; rank:number[]; op?:string; sets:number[][] }

const UnionFindPage: React.FC = () => {
  const [n, setN] = useState(10);
  const [steps, setSteps] = useState<Step[]>([]);
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(500);

  useEffect(()=>{ generateOps(); }, [n]);
  useEffect(()=>{ let t: NodeJS.Timeout; if(isAnimating && !isPaused && current<steps.length-1){ t=setTimeout(()=>setCurrent(p=>p+1), speed);} else if(current>=steps.length-1){ setIsAnimating(false);} return ()=>{ if(t) clearTimeout(t);} }, [isAnimating,isPaused,current,steps,speed]);

  const generateOps = () => {
    const parent = Array(n).fill(0).map((_,i)=>i);
    const rank = Array(n).fill(0);
    const sets = Array(n).fill(0).map((_,i)=>[i]);
    const s: Step[] = [];
    s.push({ description:'Make-Set for all elements', parent:[...parent], rank:[...rank], sets: sets.map(x=>x.slice()) });
    const ops = Array.from({length: Math.floor(n*1.5)},()=>({u:Math.floor(Math.random()*n), v:Math.floor(Math.random()*n)}));
    function find(x:number){ if(parent[x]!==x){ parent[x]=find(parent[x]); } return parent[x]; }
    function unite(a:number,b:number){ a=find(a); b=find(b); if(a===b) return 'skip'; if(rank[a]<rank[b]) [a,b]=[b,a]; parent[b]=a; if(rank[a]===rank[b]) rank[a]++; return `union(${a},${b})`; }
    for(const {u,v} of ops){ const op = unite(u,v); const classMap: {[k:number]: number[]} = {}; for(let i=0;i<n;i++){ const r=find(i); (classMap[r]||(classMap[r]=[])).push(i); } const setsNow = Object.values(classMap); s.push({ description: op==='skip'?`Skip union(${u},${v}) — same set`:`${op}`, parent:[...parent], rank:[...rank], sets: setsNow }); }
    // A few finds to show path compression effect
    for(let i=0;i<Math.min(5,n);i++){ const r=find(i); const classMap: {[k:number]: number[]} = {}; for(let j=0;j<n;j++){ const rr=find(j); (classMap[rr]||(classMap[rr]=[])).push(j);} s.push({ description:`find(${i}) -> root ${r}`, parent:[...parent], rank:[...rank], sets: Object.values(classMap) }); }
    setSteps(s); setCurrent(0);
  };

  const start = () => { if(steps.length===0) generateOps(); setIsAnimating(true); setIsPaused(false); };
  const pause = () => setIsPaused(true);
  const reset = () => { setIsAnimating(false); setIsPaused(false); setCurrent(0); };
  const fwd = () => { if(current<steps.length-1) setCurrent(p=>p+1); };
  const back = () => { if(current>0) setCurrent(p=>p-1); };

  const code = `class DSU{\n  constructor(n){ this.parent=Array(n).fill(0).map((_,i)=>i); this.rank=Array(n).fill(0); }\n  find(x){ if(this.parent[x]!==x) this.parent[x]=this.find(this.parent[x]); return this.parent[x]; }\n  union(a,b){ a=this.find(a); b=this.find(b); if(a===b) return false; if(this.rank[a]<this.rank[b]) [a,b]=[b,a]; this.parent[b]=a; if(this.rank[a]===this.rank[b]) this.rank[a]++; return true; }\n}`;

  const step = steps[current];

  return (
    <PageContainer>
      <NavigationRow>
        <BackButton to="/algorithms/graph"><FaArrowLeft/> Back to Graph Algorithms</BackButton>
      </NavigationRow>
      <PageHeader>
        <PageTitle>Union–Find (Disjoint Set)</PageTitle>
        <Description>Union by rank and path compression. Visualizes merging of sets and parent/rank changes.</Description>
      </PageHeader>
      <InfoPanel>
        <InfoTitle>Settings</InfoTitle>
        <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
          <label style={{ color:'inherit' }}>Elements:</label>
          <select value={n} onChange={e=>setN(parseInt(e.target.value,10))}>
            {Array.from({length:12},(_,i)=>i+4).map(v=>(<option key={v} value={v}>{v}</option>))}
          </select>
          <Button onClick={generateOps}><FaRandom/> New Ops</Button>
        </div>
      </InfoPanel>
      <ControlsContainer>
        <select value={speed} onChange={e=>setSpeed(parseInt(e.target.value,10))}>
          <option value="1000">Slow</option>
          <option value="500">Medium</option>
          <option value="200">Fast</option>
        </select>
        {(!isAnimating||isPaused)?(<Button onClick={start}><FaPlay/>{isPaused?'Resume':'Start'}</Button>):(<Button onClick={pause}><FaPause/>Pause</Button>)}
        <Button onClick={back} disabled={current===0 || (isAnimating && !isPaused)}><FaStepBackward/>Back</Button>
        <Button onClick={fwd} disabled={current>=steps.length-1 || (isAnimating && !isPaused)}><FaStepForward/>Forward</Button>
        <Button onClick={reset} disabled={isAnimating && !isPaused}><FaUndo/>Reset</Button>
      </ControlsContainer>
      <InfoPanel>
        <InfoTitle>Current Step</InfoTitle>
        <InfoText>{step ? step.description : 'Ready'}</InfoText>
        {step && (
          <div>
            <InfoText><strong>Parent:</strong> [{step.parent.join(', ')}]</InfoText>
            <InfoText><strong>Rank:</strong> [{step.rank.join(', ')}]</InfoText>
            <InfoText><strong>Sets:</strong> {step.sets.map(s=>`{${s.join(', ')}}`).join('  ')}</InfoText>
          </div>
        )}
      </InfoPanel>
      <InfoPanel>
        <InfoTitle>Implementation</InfoTitle>
        <CodeContainer>
          <Suspense fallback={<div>Loading code...</div>}>
            <SyntaxHighlighter language="javascript" style={vs2015}>{code}</SyntaxHighlighter>
          </Suspense>
        </CodeContainer>
      </InfoPanel>
    </PageContainer>
  );
};

export default UnionFindPage;


