import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
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
const InputGroup = styled.div`display:flex; align-items:center; gap:.5rem; margin-bottom:1rem;`;
const Label = styled.label`font-size:.9rem; color:${p=>p.theme.colors.textLight}; white-space:nowrap;`;
const Select = styled.select`padding:.5rem; border:1px solid ${p=>p.theme.colors.border}; border-radius:${p=>p.theme.borderRadius}; background:${p=>p.theme.colors.card}; color:${p=>p.theme.colors.text};`;
const GraphContainer = styled.div`display:flex; flex-direction:column; align-items:center; margin-bottom:2rem; max-width:800px;`;
const Canvas = styled.canvas`width:100%; height:420px; border:2px solid ${p=>p.theme.colors.border}; border-radius:8px; background:${p=>p.theme.colors.background};`;
const InfoPanel = styled.div`padding:1rem; background:${p=>p.theme.colors.card}; border-radius:.5rem; border:1px solid ${p=>p.theme.colors.border}; margin-bottom:2rem; max-width:800px; width:100%;`;
const InfoTitle = styled.h3`margin-bottom:.5rem; color:${p=>p.theme.colors.text}; font-size:1.1rem;`;
const InfoText = styled.p`color:${p=>p.theme.colors.textLight}; margin-bottom:.5rem; line-height:1.5; font-size:.9rem;`;
const CodeContainer = styled.div`max-width:800px; border-radius:.5rem; overflow:hidden; margin-top:1rem; width:100%;`;

interface Node { id:number; x:number; y:number; radius:number; color:string; textColor:string; label:string; }
interface Edge { source:number; target:number; weight:number; color:string; }
interface Graph { nodes:Node[]; edges:Edge[]; adj:{[k:number]: Array<[number,number]>} }
interface Step { description:string; graph:Graph; topo:number[]; dist:number[]; start:number; end:number }

const DAGPathsPage: React.FC = () => {
  const [nodeCount, setNodeCount] = useState(8);
  const [graph, setGraph] = useState<Graph>({ nodes: [], edges: [], adj: {} });
  const [steps, setSteps] = useState<Step[]>([]);
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(7);
  const [mode, setMode] = useState<'shortest'|'longest'>('shortest');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(()=>{ generateDAG(); }, [nodeCount]);
  useEffect(()=>{ let t: NodeJS.Timeout; if(isAnimating && !isPaused && current<steps.length-1){ t=setTimeout(()=>setCurrent(p=>p+1), speed);} else if(current>=steps.length-1){ setIsAnimating(false);} return ()=>{ if(t) clearTimeout(t);} }, [isAnimating,isPaused,current,steps,speed]);
  useEffect(()=>{ if(steps.length && current<steps.length) render(steps[current].graph); },[current,steps]);

  const render = (g: Graph) => {
    const c = canvasRef.current; if(!c) return; const ctx = c.getContext('2d'); if(!ctx) return;
    const r=c.getBoundingClientRect(); c.width=r.width; c.height=r.height; ctx.clearRect(0,0,c.width,c.height);
    g.edges.forEach(e=>{ const s=g.nodes[e.source], t=g.nodes[e.target]; ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(t.x,t.y); ctx.strokeStyle=e.color; ctx.lineWidth=2; ctx.stroke(); const mx=(s.x+t.x)/2, my=(s.y+t.y)/2; ctx.fillStyle='#666'; ctx.font='12px Arial'; ctx.fillText(`${e.weight}`, mx, my); });
    g.nodes.forEach(nd=>{ ctx.beginPath(); ctx.arc(nd.x, nd.y, nd.radius, 0, Math.PI*2); ctx.fillStyle=nd.color; ctx.fill(); ctx.strokeStyle='#333'; ctx.lineWidth=2; ctx.stroke(); ctx.fillStyle=nd.textColor; ctx.font='bold 14px Arial'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(nd.label, nd.x, nd.y); });
  };

  const generateDAG = () => {
    const nodes: Node[]=[]; const edges: Edge[]=[]; const adj: {[k:number]: Array<[number,number]>}={};
    const cx=400, cy=210, rad=160;
    for(let i=0;i<nodeCount;i++){ const ang=(i/nodeCount)*Math.PI*2; const x=cx+rad*Math.cos(ang), y=cy+rad*Math.sin(ang); nodes.push({ id:i, x, y, radius:20, color:'#fff', textColor:'#000', label:String(i) }); adj[i]=[]; }
    for(let u=0;u<nodeCount;u++){ const out=Math.floor(Math.random()*2)+1; for(let k=0;k<out;k++){ const v = u+1+Math.floor(Math.random()*(nodeCount-u-1)); if(!isFinite(v) || v>=nodeCount) continue; if(adj[u].some(([w])=>w===v)) continue; const w=Math.floor(Math.random()*9)+1; adj[u].push([v,w]); edges.push({ source:u, target:v, weight:w, color:'#aaa' }); } }
    const g: Graph = { nodes, edges, adj }; setGraph(g); setSteps([]); setCurrent(0); render(g); setStart(0); setEnd(Math.max(1,nodeCount-1));
  };

  const topoSort = (adj:{[k:number]:Array<[number,number]>}): number[] => {
    const n=nodeCount; const indeg=Array(n).fill(0); for(let u=0;u<n;u++) for(const [v] of adj[u]) indeg[v]++; const q:number[]=[]; for(let i=0;i<n;i++) if(indeg[i]===0) q.push(i); const order:number[]=[]; while(q.length){ const u=q.shift()!; order.push(u); for(const [v] of adj[u]) if(--indeg[v]===0) q.push(v); } return order;
  };

  const runDAGPaths = () => {
    const s: Step[]=[]; const order = topoSort(graph.adj); const INF=1e15; const dist=Array(nodeCount).fill(mode==='shortest'? INF : -INF); dist[start]=0; const g0:Graph=JSON.parse(JSON.stringify(graph)); s.push({ description:`Topo order: [${order.join(', ')}]`, graph:g0, topo:[...order], dist:[...dist], start, end });
    for(const u of order){ for(const [v,w] of graph.adj[u]){ const cand = (dist[u]=== (mode==='shortest'? INF : -INF)) ? (mode==='shortest'? INF: -INF) : (mode==='shortest'? dist[u]+w : dist[u]+w); if(mode==='shortest'){ if(cand < dist[v]) dist[v]=cand; } else { if(cand > dist[v]) dist[v]=cand; } const g1:Graph=JSON.parse(JSON.stringify(s[s.length-1].graph)); const idx=g1.edges.findIndex(e=>e.source===u&&e.target===v); if(idx!==-1) g1.edges[idx].color='#3498db'; s.push({ description:`Relax ${u}→${v} w=${w}. dist[${v}]=${dist[v]===INF?'∞':dist[v]}`, graph:g1, topo:[...order], dist:[...dist], start, end }); }
    }
    const gF:Graph=JSON.parse(JSON.stringify(s[s.length-1].graph)); s.push({ description:`${mode==='shortest'?'Shortest':'Longest'} distance to ${end} = ${dist[end]===INF?'∞':dist[end]}`, graph:gF, topo:[...order], dist:[...dist], start, end });
    setSteps(s); setCurrent(0);
  };

  const startAnim = () => { if(steps.length===0) runDAGPaths(); setIsAnimating(true); setIsPaused(false); };
  const pause = () => setIsPaused(true);
  const reset = () => { setIsAnimating(false); setIsPaused(false); setCurrent(0); const g=JSON.parse(JSON.stringify(graph)) as Graph; g.nodes.forEach(n=>{n.color='#fff'; n.textColor='#000'}); g.edges.forEach(e=>e.color='#aaa'); render(g); };
  const fwd = () => { if(current<steps.length-1) setCurrent(p=>p+1); };
  const back = () => { if(current>0) setCurrent(p=>p-1); };

  const code = `// DAG shortest/longest paths via topo order\nfunction dagPaths(adj, start, mode='shortest'){\n  const n=adj.length, INF=1e15, order=topo(adj), dist=Array(n).fill(mode==='shortest'?INF:-INF); dist[start]=0;\n  for(const u of order) for(const [v,w] of adj[u]){ const cand = dist[u]=== (mode==='shortest'?INF:-INF) ? dist[u] : dist[u]+w; if(mode==='shortest'){ if(cand < dist[v]) dist[v]=cand; } else { if(cand > dist[v]) dist[v]=cand; } }\n  return {order, dist}; }`;

  const step = steps[current];

  return (
    <PageContainer>
      <NavigationRow>
        <BackButton to="/algorithms/graph"><FaArrowLeft/> Back to Graph Algorithms</BackButton>
      </NavigationRow>
      <PageHeader>
        <PageTitle>DAG Shortest/Longest Paths</PageTitle>
        <Description>Dynamic programming along topological order for DAGs. Toggle between shortest and longest path objectives.</Description>
      </PageHeader>
      <InfoPanel>
        <InfoTitle>Settings</InfoTitle>
        <InputGroup>
          <Label>Nodes:</Label>
          <Select value={nodeCount} onChange={e=>setNodeCount(parseInt(e.target.value,10))}>
            {Array.from({length:10},(_,i)=>i+5).map(v=>(<option key={v} value={v}>{v}</option>))}
          </Select>
          <Button onClick={generateDAG}><FaRandom/> Regenerate DAG</Button>
        </InputGroup>
        <InputGroup>
          <Label>Start:</Label>
          <Select value={start} onChange={e=>setStart(parseInt(e.target.value,10))}>
            {Array.from({length:nodeCount},(_,i)=>(<option key={i} value={i}>{i}</option>))}
          </Select>
          <Label>End:</Label>
          <Select value={end} onChange={e=>setEnd(parseInt(e.target.value,10))}>
            {Array.from({length:nodeCount},(_,i)=>(<option key={i} value={i}>{i}</option>))}
          </Select>
          <Label>Mode:</Label>
          <Select value={mode} onChange={e=>setMode(e.target.value as any)}>
            <option value="shortest">Shortest</option>
            <option value="longest">Longest</option>
          </Select>
        </InputGroup>
      </InfoPanel>
      <ControlsContainer>
        <Select value={speed} onChange={e=>setSpeed(parseInt(e.target.value,10))}>
          <option value="1000">Slow</option>
          <option value="500">Medium</option>
          <option value="200">Fast</option>
        </Select>
        {(!isAnimating||isPaused)?(<Button onClick={startAnim}><FaPlay/>{isPaused?'Resume':'Start'}</Button>):(<Button onClick={pause}><FaPause/>Pause</Button>)}
        <Button onClick={back} disabled={current===0 || (isAnimating && !isPaused)}><FaStepBackward/>Back</Button>
        <Button onClick={fwd} disabled={current>=steps.length-1 || (isAnimating && !isPaused)}><FaStepForward/>Forward</Button>
        <Button onClick={reset} disabled={isAnimating && !isPaused}><FaUndo/>Reset</Button>
      </ControlsContainer>
      <GraphContainer><Canvas ref={canvasRef} /></GraphContainer>
      {step && (
        <InfoPanel>
          <InfoTitle>Current Step</InfoTitle>
          <InfoText>{step.description}</InfoText>
          <InfoText><strong>Topo:</strong> [{step.topo.join(', ')}]</InfoText>
          <InfoText><strong>Dist:</strong> [{step.dist.map(d=>d>=1e14?'∞':d).join(', ')}]</InfoText>
        </InfoPanel>
      )}
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

export default DAGPathsPage;


