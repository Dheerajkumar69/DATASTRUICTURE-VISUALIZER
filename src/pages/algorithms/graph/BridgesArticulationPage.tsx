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
interface Step { description:string; graph:Graph; tin:number[]; low:number[]; time:number; bridge?:[number,number]; ap?:number }

const BridgesArticulationPage: React.FC = () => {
  const [graph, setGraph] = useState<Graph>({ nodes: [], edges: [], adjacencyList: {} });
  const [steps, setSteps] = useState<Step[]>([]);
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [nodeCount, setNodeCount] = useState(9);
  const [mode, setMode] = useState<'bridges'|'articulation'>('bridges');
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
    // Undirected graph
    const addEdge=(u:number,v:number)=>{ if(u===v) return; if(adj[u].includes(v)) return; adj[u].push(v); adj[v].push(u); edges.push({ source:u, target:v, color:'#aaa' }); edges.push({ source:v, target:u, color:'#aaa' }); };
    for(let i=0;i<nodeCount;i++){ const deg = Math.floor(Math.random()*2)+2; for(let j=0;j<deg;j++){ addEdge(i, Math.floor(Math.random()*nodeCount)); } }
    const g: Graph = { nodes, edges, adjacencyList: adj };
    setGraph(g); render(g); setSteps([]); setCurrent(0);
  };

  const runTarjan = () => {
    const n=nodeCount; const adj=graph.adjacencyList; const tin=Array(n).fill(-1), low=Array(n).fill(-1); let timer=0; const s:Step[]=[]; const visited:boolean[]=Array(n).fill(false); const isAP:boolean[]=Array(n).fill(false);
    const pushStep=(desc:string, g:Graph, edge?:[number,number], ap?:number)=> s.push({ description:desc, graph:g, tin:[...tin], low:[...low], time:timer, bridge:edge, ap });
    function dfs(u:number, p:number){ visited[u]=true; tin[u]=low[u]=timer++; let children=0; let g1:Graph=JSON.parse(JSON.stringify(s.length? s[s.length-1].graph:graph)); g1.nodes[u].color='#ff9900'; pushStep(`Visit ${u}`, g1);
      for(const v of adj[u]){ if(v===p) continue; let g2:Graph=JSON.parse(JSON.stringify(g1)); const idx=g2.edges.findIndex(e=> (e.source===u&&e.target===v) || (e.source===v&&e.target===u)); if(idx!==-1) g2.edges[idx].color='#3498db';
        if(visited[v]){ low[u]=Math.min(low[u], tin[v]); pushStep(`Back-edge ${u}–${v}, update low[${u}]`, g2); }
        else { dfs(v,u); low[u]=Math.min(low[u], low[v]); g2=JSON.parse(JSON.stringify(s[s.length-1].graph));
          if(mode==='bridges' && low[v] > tin[u]){ const g3:Graph=JSON.parse(JSON.stringify(g2)); const idxe=g3.edges.findIndex(e=> e.source===u&&e.target===v); if(idxe!==-1) g3.edges[idxe].color='#e74c3c'; const idxe2=g3.edges.findIndex(e=> e.source===v&&e.target===u); if(idxe2!==-1) g3.edges[idxe2].color='#e74c3c'; pushStep(`Bridge ${u}–${v}`, g3, [u,v]); }
          if(mode==='articulation'){
            if(p!==-1 && low[v] >= tin[u]){ isAP[u]=true; const g4:Graph=JSON.parse(JSON.stringify(g2)); g4.nodes[u].color='#8e44ad'; g4.nodes[u].textColor='#fff'; pushStep(`Articulation point ${u}`, g4, undefined, u); }
            if(p===-1) children++; }
        }
      }
      if(mode==='articulation' && p===-1 && children>1){ isAP[u]=true; const g5:Graph=JSON.parse(JSON.stringify(s[s.length-1].graph)); g5.nodes[u].color='#8e44ad'; g5.nodes[u].textColor='#fff'; pushStep(`Root articulation point ${u}`, g5, undefined, u); }
      const g6:Graph=JSON.parse(JSON.stringify(s[s.length-1].graph)); g6.nodes[u].color='#4caf50'; g6.nodes[u].textColor='#fff'; pushStep(`Finish ${u}`, g6);
    }
    for(let i=0;i<n;i++) if(!visited[i]) dfs(i,-1);
    setSteps(s); setCurrent(0);
  };

  const start = () => { if(steps.length===0) runTarjan(); setIsAnimating(true); setIsPaused(false); };
  const pause = () => setIsPaused(true);
  const reset = () => { setIsAnimating(false); setIsPaused(false); setCurrent(0); const g=JSON.parse(JSON.stringify(graph)) as Graph; g.nodes.forEach(n=>{n.color='#fff'; n.textColor='#000'}); g.edges.forEach(e=>e.color='#aaa'); render(g); };
  const fwd = () => { if(current<steps.length-1) setCurrent(p=>p+1); };
  const back = () => { if(current>0) setCurrent(p=>p-1); };

  const code = `// Tarjan's bridges & articulation points\nfunction bridgesAP(adj){\n  const n=adj.length, tin=Array(n).fill(-1), low=Array(n).fill(-1); let timer=0; const bridges=[], ap=new Set();\n  function dfs(u,p){ tin[u]=low[u]=timer++; let children=0; for(const v of adj[u]){ if(v===p) continue; if(tin[v]!==-1){ low[u]=Math.min(low[u], tin[v]); } else { dfs(v,u); low[u]=Math.min(low[u], low[v]); if(low[v]>tin[u]) bridges.push([u,v]); if(p!==-1 && low[v]>=tin[u]) ap.add(u); children++; } } if(p===-1 && children>1) ap.add(u);}\n  for(let i=0;i<n;i++) if(tin[i]===-1) dfs(i,-1); return {bridges, ap:[...ap]}; }`;

  const step = steps[current];

  return (
    <PageContainer>
      <NavigationRow>
        <BackButton to="/algorithms/graph"><FaArrowLeft/> Back to Graph Algorithms</BackButton>
      </NavigationRow>
      <PageHeader>
        <PageTitle>Bridges and Articulation Points (Tarjan)</PageTitle>
        <Description>Find edges whose removal increases components (bridges) and vertices whose removal increases components (articulation points).</Description>
      </PageHeader>
      <InfoPanel>
        <InfoTitle>Settings</InfoTitle>
        <InputGroup>
          <Label>Nodes:</Label>
          <Select value={nodeCount} onChange={e=>setNodeCount(parseInt(e.target.value,10))}>
            {Array.from({length:10},(_,i)=>i+5).map(v=>(<option key={v} value={v}>{v}</option>))}
          </Select>
          <Button onClick={generateGraph}><FaRandom/> Regenerate</Button>
        </InputGroup>
        <InputGroup>
          <Label>Mode:</Label>
          <Select value={mode} onChange={e=>setMode(e.target.value as any)}>
            <option value="bridges">Bridges</option>
            <option value="articulation">Articulation Points</option>
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
          <InfoText><strong>tin:</strong> [{step.tin.join(', ')}]</InfoText>
          <InfoText><strong>low:</strong> [{step.low.join(', ')}]</InfoText>
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

export default BridgesArticulationPage;


