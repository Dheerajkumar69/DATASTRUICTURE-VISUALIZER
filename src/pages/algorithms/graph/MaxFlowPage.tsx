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
const Canvas = styled.canvas`width:100%; height:440px; border:2px solid ${p=>p.theme.colors.border}; border-radius:8px; background:${p=>p.theme.colors.background};`;
const InfoPanel = styled.div`padding:1rem; background:${p=>p.theme.colors.card}; border-radius:.5rem; border:1px solid ${p=>p.theme.colors.border}; margin-bottom:2rem; max-width:800px; width:100%;`;
const InfoTitle = styled.h3`margin-bottom:.5rem; color:${p=>p.theme.colors.text}; font-size:1.1rem;`;
const InfoText = styled.p`color:${p=>p.theme.colors.textLight}; margin-bottom:.5rem; line-height:1.5; font-size:.9rem;`;
const CodeContainer = styled.div`max-width:800px; border-radius:.5rem; overflow:hidden; margin-top:1rem; width:100%;`;

interface Node { id:number; x:number; y:number; radius:number; color:string; textColor:string; label:string; }
interface Edge { u:number; v:number; cap:number; flow:number; color:string; }
interface Graph { nodes:Node[]; edges:Edge[]; n:number; }
interface Step { description:string; graph:Graph; path:number[]; pathCapacity?:number; maxFlow:number }

const MaxFlowPage: React.FC = () => {
  const [n, setN] = useState(8);
  const [source, setSource] = useState(0);
  const [sink, setSink] = useState(7);
  const [graph, setGraph] = useState<Graph>({ nodes: [], edges: [], n: 0 });
  const [steps, setSteps] = useState<Step[]>([]);
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(500);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(()=>{ generateGraph(); }, [n]);
  useEffect(()=>{ let t: NodeJS.Timeout; if(isAnimating && !isPaused && current<steps.length-1){ t=setTimeout(()=>setCurrent(p=>p+1), speed);} else if(current>=steps.length-1){ setIsAnimating(false);} return ()=>{ if(t) clearTimeout(t);} }, [isAnimating,isPaused,current,steps,speed]);
  useEffect(()=>{ if(steps.length && current<steps.length) render(steps[current].graph); },[current,steps]);

  const render = (g: Graph) => {
    const c = canvasRef.current; if(!c) return; const ctx = c.getContext('2d'); if(!ctx) return;
    const r=c.getBoundingClientRect(); c.width=r.width; c.height=r.height; ctx.clearRect(0,0,c.width,c.height);
    g.edges.forEach(e=>{ const s=g.nodes[e.u], t=g.nodes[e.v]; ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(t.x,t.y); ctx.strokeStyle=e.color; ctx.lineWidth=2; ctx.stroke(); const mx=(s.x+t.x)/2, my=(s.y+t.y)/2; ctx.fillStyle='#666'; ctx.font='12px Arial'; ctx.fillText(`${e.flow}/${e.cap}`, mx, my); });
    g.nodes.forEach(nd=>{ ctx.beginPath(); ctx.arc(nd.x, nd.y, nd.radius, 0, Math.PI*2); ctx.fillStyle=nd.color; ctx.fill(); ctx.strokeStyle='#333'; ctx.lineWidth=2; ctx.stroke(); ctx.fillStyle=nd.textColor; ctx.font='bold 14px Arial'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(nd.label, nd.x, nd.y); });
  };

  const generateGraph = () => {
    const nodes: Node[]=[]; const edges: Edge[]=[]; const cx=400, cy=220, rad=170;
    for(let i=0;i<n;i++){ const ang=(i/n)*Math.PI*2; const x=cx+rad*Math.cos(ang), y=cy+rad*Math.sin(ang); nodes.push({ id:i, x, y, radius:20, color:'#fff', textColor:'#000', label:String(i) }); }
    const addEdge=(u:number,v:number,cap:number)=>{ edges.push({ u, v, cap, flow:0, color:'#aaa' }); };
    // random directed with capacities
    for(let u=0;u<n;u++){ const out = Math.floor(Math.random()*2)+2; for(let k=0;k<out;k++){ const v=Math.floor(Math.random()*n); if(v===u) continue; if(edges.some(e=>e.u===u&&e.v===v)) continue; addEdge(u,v,Math.floor(Math.random()*9)+1); } }
    const g: Graph = { nodes, edges, n };
    setGraph(g); setSteps([]); setCurrent(0); render(g);
    setSource(0); setSink(Math.max(1,n-1));
  };

  const runEdmondsKarp = () => {
    const s: Step[]=[]; const g0: Graph = JSON.parse(JSON.stringify(graph));
    s.push({ description:'Initialize max flow = 0', graph:g0, path:[], maxFlow:0 });
    // residual adjacency
    const adj:number[][] = Array.from({length:n},()=>[]);
    const cap:number[][] = Array.from({length:n},()=>Array(n).fill(0));
    const flow:number[][] = Array.from({length:n},()=>Array(n).fill(0));
    for(const e of graph.edges){ adj[e.u].push(e.v); adj[e.v].push(e.u); cap[e.u][e.v]+=e.cap; }
    let maxFlow=0;
    const bfs = (): {parent:number[], pathCap:number} | null => {
      const parent = Array(n).fill(-1); parent[source]=source; const q=[source]; const INF=1e9; const pathCap=Array(n).fill(0); pathCap[source]=INF;
      while(q.length){ const u=q.shift()!; for(const v of adj[u]){ if(parent[v]===-1 && cap[u][v]-flow[u][v] > 0){ parent[v]=u; pathCap[v]=Math.min(pathCap[u], cap[u][v]-flow[u][v]); if(v===sink){ return { parent, pathCap: pathCap[v] }; } q.push(v); } } }
      return null;
    };
    while(true){
      const res = bfs();
      if(!res){ const gF: Graph = JSON.parse(JSON.stringify(s[s.length-1].graph)); for(const e of gF.edges){ e.flow = flow[e.u][e.v]; } s.push({ description:`No augmenting path. Max flow = ${maxFlow}.`, graph:gF, path:[], maxFlow }); break; }
      const { parent, pathCap } = res; maxFlow += pathCap;
      // build path
      const path:number[]=[]; let v=sink; while(v!==source){ path.push(v); v=parent[v]; } path.push(source); path.reverse();
      // apply flow
      for(let i=0;i<path.length-1;i++){ const u=path[i], v=path[i+1]; flow[u][v]+=pathCap; flow[v][u]-=pathCap; }
      const g1: Graph = JSON.parse(JSON.stringify(s[s.length-1].graph));
      // highlight path and update displayed flows
      for(let i=0;i<path.length-1;i++){ const u=path[i], v=path[i+1]; const idx=g1.edges.findIndex(e=>e.u===u&&e.v===v); if(idx!==-1) g1.edges[idx].color='#3498db'; }
      for(const e of g1.edges){ e.flow = flow[e.u][e.v]; }
      s.push({ description:`Augment path ${path.join(' → ')} with capacity ${pathCap}. Max flow = ${maxFlow}.`, graph:g1, path, pathCapacity:pathCap, maxFlow });
    }
    setSteps(s); setCurrent(0);
  };

  const start = () => { if(steps.length===0) runEdmondsKarp(); setIsAnimating(true); setIsPaused(false); };
  const pause = () => setIsPaused(true);
  const reset = () => { setIsAnimating(false); setIsPaused(false); setCurrent(0); const g=JSON.parse(JSON.stringify(graph)) as Graph; g.nodes.forEach(n=>{n.color='#fff'; n.textColor='#000'}); g.edges.forEach(e=>e.color='#aaa'); render(g); };
  const fwd = () => { if(current<steps.length-1) setCurrent(p=>p+1); };
  const back = () => { if(current>0) setCurrent(p=>p-1); };

  const code = `// Edmonds–Karp (BFS augmenting paths)\nfunction edmondsKarp(n, edges, s, t){\n  const adj=Array.from({length:n},()=>[]), cap=Array.from({length:n},()=>Array(n).fill(0)), flow=Array.from({length:n},()=>Array(n).fill(0));\n  for(const [u,v,c] of edges){ adj[u].push(v); adj[v].push(u); cap[u][v]+=c; }\n  let maxFlow=0;\n  const bfs=()=>{ const parent=Array(n).fill(-1); parent[s]=s; const q=[s], INF=1e9, pc=Array(n).fill(0); pc[s]=INF; while(q.length){ const u=q.shift(); for(const v of adj[u]) if(parent[v]===-1 && cap[u][v]-flow[u][v]>0){ parent[v]=u; pc[v]=Math.min(pc[u], cap[u][v]-flow[u][v]); if(v===t) return {parent, val:pc[v]}; q.push(v);} } return null; };\n  while(true){ const r=bfs(); if(!r) break; maxFlow+=r.val; let v=t; while(v!==s){ const u=r.parent[v]; flow[u][v]+=r.val; flow[v][u]-=r.val; v=u; } }\n  return {maxFlow, flow}; }`;

  const step = steps[current];

  return (
    <PageContainer>
      <NavigationRow>
        <BackButton to="/algorithms/graph"><FaArrowLeft/> Back to Graph Algorithms</BackButton>
      </NavigationRow>
      <PageHeader>
        <PageTitle>Max Flow (Edmonds–Karp)</PageTitle>
        <Description>Finds maximum s→t flow using BFS-based augmenting paths in the residual network. Shows residual capacities and flow updates.</Description>
      </PageHeader>
      <InfoPanel>
        <InfoTitle>Settings</InfoTitle>
        <InputGroup>
          <Label>Nodes:</Label>
          <Select value={n} onChange={e=>setN(parseInt(e.target.value,10))}>
            {Array.from({length:10},(_,i)=>i+4).map(v=>(<option key={v} value={v}>{v}</option>))}
          </Select>
          <Button onClick={generateGraph}><FaRandom/> Regenerate</Button>
        </InputGroup>
        <InputGroup>
          <Label>Source:</Label>
          <Select value={source} onChange={e=>setSource(parseInt(e.target.value,10))}>
            {Array.from({length:n},(_,i)=>(<option key={i} value={i}>{i}</option>))}
          </Select>
          <Label>Sink:</Label>
          <Select value={sink} onChange={e=>setSink(parseInt(e.target.value,10))}>
            {Array.from({length:n},(_,i)=>(<option key={i} value={i}>{i}</option>))}
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
          <InfoText><strong>Augmenting Path:</strong> {step.path.length? step.path.join(' → '): 'None'}</InfoText>
          <InfoText><strong>Max Flow:</strong> {step.maxFlow}</InfoText>
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

export default MaxFlowPage;


