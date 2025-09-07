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
const Canvas = styled.canvas`width:100%; height:400px; border:2px solid ${p=>p.theme.colors.border}; border-radius:8px; background:${p=>p.theme.colors.background};`;
const InfoPanel = styled.div`padding:1rem; background:${p=>p.theme.colors.card}; border-radius:.5rem; border:1px solid ${p=>p.theme.colors.border}; margin-bottom:2rem; max-width:800px; width:100%;`;
const InfoTitle = styled.h3`margin-bottom:.5rem; color:${p=>p.theme.colors.text}; font-size:1.1rem;`;
const InfoText = styled.p`color:${p=>p.theme.colors.textLight}; margin-bottom:.5rem; line-height:1.5; font-size:.9rem;`;
const CodeContainer = styled.div`max-width:800px; border-radius:.5rem; overflow:hidden; margin-top:1rem; width:100%;`;

interface Node { id:number; x:number; y:number; radius:number; color:string; textColor:string; label:string; }
interface Edge { source:number; target:number; color:string; }
interface Graph { nodes:Node[]; edges:Edge[]; adjacencyList: { [k:number]: number[] } }
interface Step { description:string; graph:Graph; queue:number[]; order:number[]; removed?:number }

const TopologicalSortPage: React.FC = () => {
  const [graph, setGraph] = useState<Graph>({ nodes: [], edges: [], adjacencyList: {} });
  const [steps, setSteps] = useState<Step[]>([]);
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [nodeCount, setNodeCount] = useState(8);
  const [algo, setAlgo] = useState<'kahn'|'dfs'>('kahn');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(()=>{ generateDAG(); }, [nodeCount]);
  useEffect(()=>{ let t: NodeJS.Timeout; if(isAnimating && !isPaused && current<steps.length-1){ t=setTimeout(()=>setCurrent(p=>p+1), speed);} else if(current>=steps.length-1){ setIsAnimating(false);} return ()=>{ if(t) clearTimeout(t);} }, [isAnimating,isPaused,current,steps,speed]);
  useEffect(()=>{ if(steps.length && current<steps.length) render(steps[current].graph); },[current,steps]);

  const render = (g: Graph) => {
    const c = canvasRef.current; if(!c) return; const ctx = c.getContext('2d'); if(!ctx) return;
    const r=c.getBoundingClientRect(); c.width=r.width; c.height=r.height; ctx.clearRect(0,0,c.width,c.height);
    g.edges.forEach(e=>{ const s=g.nodes[e.source], t=g.nodes[e.target]; ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(t.x,t.y); ctx.strokeStyle=e.color; ctx.lineWidth=2; ctx.stroke(); });
    g.nodes.forEach(n=>{ ctx.beginPath(); ctx.arc(n.x,n.y,n.radius,0,Math.PI*2); ctx.fillStyle=n.color; ctx.fill(); ctx.strokeStyle='#333'; ctx.lineWidth=2; ctx.stroke(); ctx.fillStyle=n.textColor; ctx.font='bold 14px Arial'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(n.label,n.x,n.y); });
  };

  const generateDAG = () => {
    const nodes: Node[]=[]; const edges: Edge[]=[]; const adj: {[k:number]:number[]}={};
    const cx=400, cy=200, rad=150;
    for(let i=0;i<nodeCount;i++){ const ang=(i/nodeCount)*Math.PI*2; const x=cx+rad*Math.cos(ang), y=cy+rad*Math.sin(ang);
      nodes.push({ id:i, x, y, radius:20, color:'#fff', textColor:'#000', label:String(i) }); adj[i]=[];
    }
    for(let i=0;i<nodeCount;i++){
      const out = Math.floor(Math.random()*2)+1;
      for(let j=0;j<out;j++){
        const to = i + 1 + Math.floor(Math.random()*(nodeCount - i - 1));
        if(!isFinite(to) || to>=nodeCount) continue;
        if(adj[i].includes(to)) continue;
        adj[i].push(to); edges.push({ source:i, target:to, color:'#aaa' });
      }
    }
    const g: Graph = { nodes, edges, adjacencyList: adj };
    setGraph(g); render(g); setSteps([]); setCurrent(0);
  };

  const runKahn = () => {
    const indeg = Array(nodeCount).fill(0); for(let u=0;u<nodeCount;u++) for(const v of graph.adjacencyList[u]) indeg[v]++;
    const q:number[]=[]; for(let i=0;i<nodeCount;i++) if(indeg[i]===0) q.push(i);
    const order:number[]=[]; const s: Step[]=[];
    s.push({ description:'Initialize in-degrees and queue with 0-in-degree nodes', graph: JSON.parse(JSON.stringify(graph)), queue:[...q], order:[] });
    const adj = graph.adjacencyList;
    while(q.length){
      const u=q.shift()!; order.push(u);
      const g1: Graph = JSON.parse(JSON.stringify(s[s.length-1].graph)); g1.nodes[u].color='#4caf50'; g1.nodes[u].textColor='#fff';
      s.push({ description:`Remove ${u} from queue; append to order`, graph:g1, queue:[...q], order:[...order], removed:u });
      for(const v of adj[u]){
        indeg[v]--; const g2: Graph = JSON.parse(JSON.stringify(g1)); const idx=g2.edges.findIndex(e=>e.source===u&&e.target===v); if(idx!==-1) g2.edges[idx].color='#3498db';
        s.push({ description:`Decrease in-degree of ${v} to ${indeg[v]}`, graph:g2, queue:[...q], order:[...order] });
        if(indeg[v]===0){ q.push(v); const g3: Graph = JSON.parse(JSON.stringify(g2)); g3.nodes[v].color='#ffcc00';
          s.push({ description:`Enqueue ${v} as in-degree is 0`, graph:g3, queue:[...q], order:[...order] });
        }
      }
    }
    setSteps(s); setCurrent(0);
  };

  const runDFS = () => {
    const visited:boolean[] = Array(nodeCount).fill(false); const order:number[]=[]; const s:Step[]=[];
    const adj = graph.adjacencyList;
    const g0: Graph = JSON.parse(JSON.stringify(graph));
    s.push({ description:'Start DFS-based topological sort', graph:g0, queue:[], order:[] });
    function dfs(u:number){
      visited[u]=true; const g1: Graph = JSON.parse(JSON.stringify(s[s.length-1].graph)); g1.nodes[u].color='#ff9900';
      s.push({ description:`Visit ${u}`, graph:g1, queue:[], order:[...order] });
      for(const v of adj[u]) if(!visited[v]){ const g2: Graph = JSON.parse(JSON.stringify(g1)); const idx=g2.edges.findIndex(e=>e.source===u&&e.target===v); if(idx!==-1) g2.edges[idx].color='#3498db';
        s.push({ description:`Tree edge ${u}→${v}`, graph:g2, queue:[], order:[...order] }); dfs(v);
      }
      order.push(u); const g3: Graph = JSON.parse(JSON.stringify(s[s.length-1].graph)); g3.nodes[u].color='#4caf50'; g3.nodes[u].textColor='#fff';
      s.push({ description:`Push ${u} to order (post-order)`, graph:g3, queue:[], order:[...order] });
    }
    for(let i=0;i<nodeCount;i++) if(!visited[i]) dfs(i);
    setSteps(s); setCurrent(0);
  };

  const start = () => { if(steps.length===0){ algo==='kahn' ? runKahn() : runDFS(); } setIsAnimating(true); setIsPaused(false); };
  const pause = () => setIsPaused(true);
  const reset = () => { setIsAnimating(false); setIsPaused(false); setCurrent(0); const g=JSON.parse(JSON.stringify(graph)) as Graph; g.nodes.forEach(n=>{n.color='#fff'; n.textColor='#000'}); g.edges.forEach(e=>e.color='#aaa'); render(g); };
  const fwd = () => { if(current<steps.length-1) setCurrent(p=>p+1); };
  const back = () => { if(current>0) setCurrent(p=>p-1); };

  const code = `// Kahn's algorithm\nfunction topoKahn(adj){\n  const n=adj.length, indeg=Array(n).fill(0); for(let u=0;u<n;u++) for(const v of adj[u]) indeg[v]++;\n  const q=[]; for(let i=0;i<n;i++) if(indeg[i]===0) q.push(i);\n  const order=[]; while(q.length){ const u=q.shift(); order.push(u); for(const v of adj[u]){ if(--indeg[v]===0) q.push(v); } }\n  return order;\n}`;

  const step = steps[current];

  return (
    <PageContainer>
      <NavigationRow>
        <BackButton to="/algorithms/graph"><FaArrowLeft/> Back to Graph Algorithms</BackButton>
      </NavigationRow>
      <PageHeader>
        <PageTitle>Topological Sort (Kahn + DFS)</PageTitle>
        <Description>Ordering of DAG vertices such that every directed edge u→v has u before v. Choose Kahn or DFS method.</Description>
      </PageHeader>
      <InfoPanel>
        <InfoTitle>Settings</InfoTitle>
        <InputGroup>
          <Label>Nodes:</Label>
          <Select value={nodeCount} onChange={e=>setNodeCount(parseInt(e.target.value,10))}>
            {Array.from({length:10},(_,i)=>i+3).map(v=>(<option key={v} value={v}>{v}</option>))}
          </Select>
          <Button onClick={generateDAG}><FaRandom/> Regenerate DAG</Button>
        </InputGroup>
        <InputGroup>
          <Label>Algorithm:</Label>
          <Select value={algo} onChange={e=>setAlgo(e.target.value as any)}>
            <option value="kahn">Kahn</option>
            <option value="dfs">DFS</option>
          </Select>
        </InputGroup>
      </InfoPanel>
      <ControlsContainer>
        <Select value={speed} onChange={e=>setSpeed(parseInt(e.target.value,10))}>
          <option value="1000">Slow</option>
          <option value="500">Medium</option>
          <option value="200">Fast</option>
        </Select>
        {(!isAnimating||isPaused)?(<Button onClick={start}><FaPlay/>{isPaused?'Resume':'Start'}</Button>):(<Button onClick={pause}><FaPause/>Pause</Button>)}
        <Button onClick={back} disabled={current===0 || (isAnimating && !isPaused)}><FaStepBackward/>Back</Button>
        <Button onClick={fwd} disabled={current>=steps.length-1 || (isAnimating && !isPaused)}><FaStepForward/>Forward</Button>
        <Button onClick={reset} disabled={isAnimating && !isPaused}><FaUndo/>Reset</Button>
      </ControlsContainer>
      <GraphContainer><Canvas ref={canvasRef} /></GraphContainer>
      {step && (
        <InfoPanel>
          <InfoTitle>Current Step</InfoTitle>
          <InfoText>{step.description}</InfoText>
          <InfoText><strong>Order:</strong> [{step.order.join(', ')}]</InfoText>
          {algo==='kahn' && <InfoText><strong>Queue:</strong> [{step.queue.join(', ')}]</InfoText>}
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

export default TopologicalSortPage;


