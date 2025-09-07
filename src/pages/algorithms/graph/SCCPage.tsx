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
interface Edge { source:number; target:number; color:string; }
interface Graph { nodes:Node[]; edges:Edge[]; adjacencyList: { [k:number]: number[] } }
interface Step { description:string; graph:Graph; order?:number[]; stack?:number[]; component?:number[]; phase:'dfs1'|'transpose'|'dfs2' }

const SCCPage: React.FC = () => {
  const [graph, setGraph] = useState<Graph>({ nodes: [], edges: [], adjacencyList: {} });
  const [steps, setSteps] = useState<Step[]>([]);
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [nodeCount, setNodeCount] = useState(8);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(()=>{ generateGraph(); }, [nodeCount]);
  useEffect(()=>{ let t: NodeJS.Timeout; if(isAnimating && !isPaused && current<steps.length-1){ t=setTimeout(()=>setCurrent(p=>p+1), speed);} else if(current>=steps.length-1){ setIsAnimating(false);} return ()=>{ if(t) clearTimeout(t);} }, [isAnimating,isPaused,current,steps,speed]);
  useEffect(()=>{ if(steps.length && current<steps.length) render(steps[current].graph); },[current,steps]);

  const render = (g: Graph) => {
    const c = canvasRef.current; if(!c) return; const ctx = c.getContext('2d'); if(!ctx) return;
    const r=c.getBoundingClientRect(); c.width=r.width; c.height=r.height; ctx.clearRect(0,0,c.width,c.height);
    g.edges.forEach(e=>{ const s=g.nodes[e.source], t=g.nodes[e.target]; ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(t.x,t.y); ctx.strokeStyle=e.color; ctx.lineWidth=2; ctx.stroke(); });
    g.nodes.forEach(n=>{ ctx.beginPath(); ctx.arc(n.x,n.y,n.radius,0,Math.PI*2); ctx.fillStyle=n.color; ctx.fill(); ctx.strokeStyle='#333'; ctx.lineWidth=2; ctx.stroke(); ctx.fillStyle=n.textColor; ctx.font='bold 14px Arial'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(n.label,n.x,n.y); });
  };

  const generateGraph = () => {
    const nodes: Node[]=[]; const edges: Edge[]=[]; const adj: {[k:number]:number[]}={};
    const cx=400, cy=210, rad=160;
    for(let i=0;i<nodeCount;i++){ const ang=(i/nodeCount)*Math.PI*2; const x=cx+rad*Math.cos(ang), y=cy+rad*Math.sin(ang);
      nodes.push({ id:i, x, y, radius:20, color:'#fff', textColor:'#000', label:String(i) }); adj[i]=[];
    }
    // Add random directed edges
    for(let i=0;i<nodeCount;i++){
      const out = Math.floor(Math.random()*3)+1;
      for(let j=0;j<out;j++){
        const to = Math.floor(Math.random()*nodeCount);
        if(to===i) continue; if(adj[i].includes(to)) continue;
        adj[i].push(to); edges.push({ source:i, target:to, color:'#aaa' });
      }
    }
    const g: Graph = { nodes, edges, adjacencyList: adj };
    setGraph(g); render(g); setSteps([]); setCurrent(0);
  };

  const runKosaraju = () => {
    const n = nodeCount; const adj = graph.adjacencyList; const visited:boolean[] = Array(n).fill(false); const order:number[]=[]; const s: Step[]=[];
    const g0: Graph = JSON.parse(JSON.stringify(graph));
    s.push({ description:'First DFS pass to compute finishing times', graph:g0, phase:'dfs1' });
    function dfs1(u:number){ visited[u]=true; const g1: Graph = JSON.parse(JSON.stringify(s[s.length-1].graph)); g1.nodes[u].color='#ff9900'; s.push({ description:`Visit ${u}`, graph:g1, phase:'dfs1', order:[...order] }); for(const v of adj[u]) if(!visited[v]) dfs1(v); order.push(u); const g2: Graph = JSON.parse(JSON.stringify(g1)); g2.nodes[u].color='#4caf50'; g2.nodes[u].textColor='#fff'; s.push({ description:`Push ${u} to order`, graph:g2, phase:'dfs1', order:[...order] }); }
    for(let i=0;i<n;i++) if(!visited[i]) dfs1(i);

    // transpose
    const tadj: {[k:number]:number[]} = {}; for(let i=0;i<n;i++) tadj[i]=[]; for(let u=0;u<n;u++) for(const v of adj[u]) tadj[v].push(u);
    const gT: Graph = { nodes: JSON.parse(JSON.stringify(graph.nodes)), edges: [], adjacencyList: tadj };
    // rebuild edges for visualization
    for(let u=0;u<n;u++) for(const v of tadj[u]) gT.edges.push({ source:u, target:v, color:'#aaa' });
    s.push({ description:'Transpose the graph', graph:gT, phase:'transpose' });

    // second pass
    const visited2:boolean[] = Array(n).fill(false);
    function dfs2(u:number, component:number[]){ visited2[u]=true; component.push(u); for(const v of tadj[u]) if(!visited2[v]) dfs2(v, component); }
    for(let idx=order.length-1; idx>=0; idx--){ const u=order[idx]; if(!visited2[u]){ const comp:number[]=[]; dfs2(u, comp); const gC: Graph = JSON.parse(JSON.stringify(gT)); gC.nodes.forEach(nd=>{ if(comp.includes(nd.id)){ nd.color='#8e44ad'; nd.textColor='#fff'; } }); s.push({ description:`SCC: { ${comp.join(', ')} }`, graph:gC, phase:'dfs2', component:comp.slice() }); } }
    setSteps(s); setCurrent(0);
  };

  const start = () => { if(steps.length===0) runKosaraju(); setIsAnimating(true); setIsPaused(false); };
  const pause = () => setIsPaused(true);
  const reset = () => { setIsAnimating(false); setIsPaused(false); setCurrent(0); const g=JSON.parse(JSON.stringify(graph)) as Graph; g.nodes.forEach(n=>{n.color='#fff'; n.textColor='#000'}); g.edges.forEach(e=>e.color='#aaa'); render(g); };
  const fwd = () => { if(current<steps.length-1) setCurrent(p=>p+1); };
  const back = () => { if(current>0) setCurrent(p=>p-1); };

  const code = `// Kosaraju's algorithm\nfunction kosaraju(adj){\n  const n=adj.length, vis=Array(n).fill(false), order=[];\n  function dfs1(u){ vis[u]=true; for(const v of adj[u]) if(!vis[v]) dfs1(v); order.push(u); }\n  for(let i=0;i<n;i++) if(!vis[i]) dfs1(i);\n  const tadj=Array.from({length:n},()=>[]); for(let u=0;u<n;u++) for(const v of adj[u]) tadj[v].push(u);\n  const vis2=Array(n).fill(false), comps=[];\n  function dfs2(u,comp){ vis2[u]=true; comp.push(u); for(const v of tadj[u]) if(!vis2[v]) dfs2(v,comp); }\n  for(let i=order.length-1;i>=0;i--){ const u=order[i]; if(!vis2[u]){ const comp=[]; dfs2(u,comp); comps.push(comp); } }\n  return comps;\n}`;

  const step = steps[current];

  return (
    <PageContainer>
      <NavigationRow>
        <BackButton to="/algorithms/graph"><FaArrowLeft/> Back to Graph Algorithms</BackButton>
      </NavigationRow>
      <PageHeader>
        <PageTitle>Strongly Connected Components (Kosaraju)</PageTitle>
        <Description>Decomposes a directed graph into strongly connected components using two DFS passes with graph transposition.</Description>
      </PageHeader>
      <InfoPanel>
        <InfoTitle>Settings</InfoTitle>
        <InputGroup>
          <Label>Nodes:</Label>
          <Select value={nodeCount} onChange={e=>setNodeCount(parseInt(e.target.value,10))}>
            {Array.from({length:10},(_,i)=>i+3).map(v=>(<option key={v} value={v}>{v}</option>))}
          </Select>
          <Button onClick={generateGraph}><FaRandom/> Regenerate</Button>
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

export default SCCPage;


