import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaPlay, FaPause, FaUndo, FaStepForward, FaStepBackward, FaRandom } from 'react-icons/fa';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const SyntaxHighlighter = lazy(() => import('react-syntax-highlighter'));

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  height: 100%;
  overflow-y: auto;
`;
const NavigationRow = styled.div`display: flex; align-items: center; margin-bottom: 1.5rem;`;
const BackButton = styled(Link)`display: flex; align-items: center; color: ${p=>p.theme.colors.primary}; font-weight: 500; text-decoration: none; margin-right: 1rem; svg{margin-right:.5rem}`;
const PageHeader = styled.div`margin-bottom: 2rem;`;
const PageTitle = styled.h1`font-size: 2rem; margin-bottom: .5rem; color: ${p=>p.theme.colors.text};`;
const Description = styled.p`font-size: 1rem; color:${p=>p.theme.colors.textLight}; max-width:800px; line-height:1.6; margin-bottom:2rem;`;
const ControlsContainer = styled.div`display:grid; grid-template-columns: repeat(auto-fit,minmax(120px,1fr)); gap:1rem; margin-bottom:2rem; max-width:800px;`;
const Button = styled.button`display:flex; align-items:center; justify-content:center; padding:.75rem 1rem; background:${p=>p.theme.colors.card}; color:${p=>p.theme.colors.text}; border:1px solid ${p=>p.theme.colors.border}; border-radius:.5rem; cursor:pointer; font-weight:500; transition:.2s; svg{margin-right:.5rem} &:hover{background:${p=>p.theme.colors.hover}} &:disabled{opacity:.5; cursor:not-allowed}`;
const InputGroup = styled.div`display:flex; align-items:center; gap:.5rem; margin-bottom:1rem;`;
const Label = styled.label`font-size:.9rem; color:${p=>p.theme.colors.textLight}; white-space:nowrap;`;
const Input = styled.input`padding:.5rem; border:1px solid ${p=>p.theme.colors.border}; border-radius:${p=>p.theme.borderRadius}; background:${p=>p.theme.colors.card}; color:${p=>p.theme.colors.text}; width:60px;`;
const Select = styled.select`padding:.5rem; border:1px solid ${p=>p.theme.colors.border}; border-radius:${p=>p.theme.borderRadius}; background:${p=>p.theme.colors.card}; color:${p=>p.theme.colors.text};`;
const GraphContainer = styled.div`display:flex; flex-direction:column; align-items:center; margin-bottom:2rem; max-width:800px;`;
const Canvas = styled.canvas`width:100%; height:400px; border:2px solid ${p=>p.theme.colors.border}; border-radius:8px; background:${p=>p.theme.colors.background};`;
const InfoPanel = styled.div`padding:1rem; background:${p=>p.theme.colors.card}; border-radius:.5rem; border:1px solid ${p=>p.theme.colors.border}; margin-bottom:2rem; max-width:800px; width:100%;`;
const InfoTitle = styled.h3`margin-bottom:.5rem; color:${p=>p.theme.colors.text}; font-size:1.1rem;`;
const InfoText = styled.p`color:${p=>p.theme.colors.textLight}; margin-bottom:.5rem; line-height:1.5; font-size:.9rem;`;
const CodeContainer = styled.div`max-width:800px; border-radius:.5rem; overflow:hidden; margin-top:1rem; width:100%;`;

interface Node { id:number; x:number; y:number; radius:number; color:string; textColor:string; label:string; }
interface Edge { source:number; target:number; weight:number; color:string; }
interface Graph { nodes:Node[]; edges:Edge[]; }
interface Step { iteration:number; edge?:[number,number,number]; description:string; graph:Graph; distances:number[]; previous:(number|null)[] }

const BellmanFordPage: React.FC = () => {
  const [graph, setGraph] = useState<Graph>({ nodes: [], edges: [] });
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(500);
  const [nodeCount, setNodeCount] = useState(7);
  const [startNode, setStartNode] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => { generateRandomGraph(); }, [nodeCount]);
  useEffect(() => {
    let t: NodeJS.Timeout;
    if (isAnimating && !isPaused && currentStep < steps.length - 1) t = setTimeout(()=>setCurrentStep(p=>p+1), animationSpeed);
    else if (currentStep >= steps.length - 1) setIsAnimating(false);
    return ()=>{ if (t) clearTimeout(t); };
  }, [isAnimating, isPaused, currentStep, steps, animationSpeed]);
  useEffect(() => { if (steps.length && currentStep < steps.length) renderGraph(steps[currentStep].graph); }, [currentStep, steps]);

  const renderGraph = (g: Graph) => {
    const c = canvasRef.current; if (!c) return; const ctx = c.getContext('2d'); if (!ctx) return;
    const r = c.getBoundingClientRect(); c.width = r.width; c.height = r.height; ctx.clearRect(0,0,c.width,c.height);
    g.edges.forEach(e=>{ const s=g.nodes[e.source], t=g.nodes[e.target]; ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(t.x,t.y); ctx.strokeStyle=e.color; ctx.lineWidth=2; ctx.stroke(); const mx=(s.x+t.x)/2,my=(s.y+t.y)/2; ctx.fillStyle='#666'; ctx.font='12px Arial'; ctx.fillText(String(e.weight), mx, my); });
    g.nodes.forEach(n=>{ ctx.beginPath(); ctx.arc(n.x,n.y,n.radius,0,Math.PI*2); ctx.fillStyle=n.color; ctx.fill(); ctx.strokeStyle='#333'; ctx.lineWidth=2; ctx.stroke(); ctx.fillStyle=n.textColor; ctx.font='bold 14px Arial'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(n.label,n.x,n.y); });
  };

  const generateRandomGraph = () => {
    const nodes: Node[] = []; const edges: Edge[] = [];
    const cx=400, cy=200, rad=150;
    for (let i=0;i<nodeCount;i++){ const ang=(i/nodeCount)*Math.PI*2; const x=cx+rad*Math.cos(ang), y=cy+rad*Math.sin(ang);
      nodes.push({ id:i, x, y, radius:20, color:'#fff', textColor:'#000', label:String(i) }); }
    // allow negative weights
    for (let i=0;i<nodeCount;i++){ const deg = Math.floor(Math.random()*2)+2; for (let j=0;j<deg;j++){ const t = Math.floor(Math.random()*nodeCount); if (t===i) continue; const w = Math.floor(Math.random()*11)-5 || 1; edges.push({ source:i, target:t, weight:w, color:'#aaa' }); }}
    const g = { nodes, edges }; setGraph(g); renderGraph(g); setSteps([]); setCurrentStep(0);
  };

  const runBellmanFord = () => {
    const n = graph.nodes.length; if (!n) return;
    const dist = Array(n).fill(Infinity); const prev:(number|null)[] = Array(n).fill(null); dist[startNode]=0;
    const s: Step[] = [];
    s.push({ iteration:0, description:`Initialize distances, start at ${startNode}.`, graph: JSON.parse(JSON.stringify(graph)), distances:[...dist], previous:[...prev] });
    for (let it=1; it<=n-1; it++) {
      let updated=false;
      for (const e of graph.edges) {
        const g2: Graph = JSON.parse(JSON.stringify(s[s.length-1].graph));
        const idx = g2.edges.findIndex(x=>x.source===e.source && x.target===e.target && x.weight===e.weight);
        if (idx!==-1) g2.edges[idx].color = '#3498db';
        const cand = dist[e.source] + e.weight;
        s.push({ iteration:it, edge:[e.source,e.target,e.weight], description:`Relax edge (${e.source} → ${e.target}) w=${e.weight}.`, graph:g2, distances:[...dist], previous:[...prev] });
        if (dist[e.source]!==Infinity && cand < dist[e.target]) { dist[e.target]=cand; prev[e.target]=e.source; updated=true;
          const g3: Graph = JSON.parse(JSON.stringify(g2));
          s.push({ iteration:it, edge:[e.source,e.target,e.weight], description:`Update dist[${e.target}]=${cand}, prev[${e.target}]=${e.source}.`, graph:g3, distances:[...dist], previous:[...prev] });
        }
      }
      if (!updated) { s.push({ iteration:it, description:'No updates in this pass. Early stop.', graph: JSON.parse(JSON.stringify(s[s.length-1].graph)), distances:[...dist], previous:[...prev] }); break; }
    }
    // negative cycle check
    let neg=false; for (const e of graph.edges){ if (dist[e.source]!==Infinity && dist[e.source]+e.weight < dist[e.target]) { neg=true; break; } }
    if (neg) {
      const g4: Graph = JSON.parse(JSON.stringify(s[s.length-1].graph));
      s.push({ iteration:n, description:'Negative cycle detected.', graph:g4, distances:[...dist], previous:[...prev] });
    } else {
      const g5: Graph = JSON.parse(JSON.stringify(s[s.length-1].graph));
      s.push({ iteration:n, description:'No negative cycle. Distances finalized.', graph:g5, distances:[...dist], previous:[...prev] });
    }
    setSteps(s); setCurrentStep(0);
  };

  const start = () => { if (steps.length===0) runBellmanFord(); setIsAnimating(true); setIsPaused(false); };
  const pause = () => setIsPaused(true);
  const reset = () => { setIsAnimating(false); setIsPaused(false); setCurrentStep(0); const g=JSON.parse(JSON.stringify(graph)) as Graph; g.nodes.forEach(n=>{n.color='#fff';n.textColor='#000'}); g.edges.forEach(e=>e.color='#aaa'); renderGraph(g); };
  const fwd = () => { if (currentStep < steps.length-1) setCurrentStep(p=>p+1); };
  const back = () => { if (currentStep > 0) setCurrentStep(p=>p-1); };

  return (
    <PageContainer>
      <NavigationRow>
        <BackButton to="/algorithms/graph"><FaArrowLeft/> Back to Graph Algorithms</BackButton>
      </NavigationRow>
      <PageHeader>
        <PageTitle>Bellman–Ford</PageTitle>
        <Description>Finds shortest paths with support for negative edges; detects negative cycles.</Description>
      </PageHeader>
      <InfoPanel>
        <InfoTitle>Graph Settings</InfoTitle>
        <InputGroup>
          <Label>Nodes:</Label>
          <Input type="number" min="3" max="12" value={nodeCount} onChange={e=>setNodeCount(parseInt(e.target.value,10)||7)} />
          <Button onClick={generateRandomGraph}><FaRandom/> Regenerate</Button>
        </InputGroup>
        <InputGroup>
          <Label>Start:</Label>
          <Select value={startNode} onChange={e=>setStartNode(parseInt(e.target.value,10))}>
            {Array.from({length:nodeCount},(_,i)=>(<option key={i} value={i}>{i}</option>))}
          </Select>
        </InputGroup>
      </InfoPanel>
      <ControlsContainer>
        <Select value={animationSpeed} onChange={e=>setAnimationSpeed(parseInt(e.target.value,10))}>
          <option value="1000">Slow</option>
          <option value="500">Medium</option>
          <option value="200">Fast</option>
        </Select>
        {(!isAnimating||isPaused)?(<Button onClick={start}><FaPlay/>{isPaused?'Resume':'Start'}</Button>):(<Button onClick={pause}><FaPause/>Pause</Button>)}
        <Button onClick={back} disabled={currentStep===0|| (isAnimating && !isPaused)}><FaStepBackward/>Back</Button>
        <Button onClick={fwd} disabled={currentStep>=steps.length-1 || (isAnimating && !isPaused)}><FaStepForward/>Forward</Button>
        <Button onClick={reset} disabled={isAnimating && !isPaused}><FaUndo/>Reset</Button>
      </ControlsContainer>
      <GraphContainer><Canvas ref={canvasRef} /></GraphContainer>
      {steps.length>0 && currentStep<steps.length && (
        <InfoPanel>
          <InfoTitle>Current Step</InfoTitle>
          <InfoText>{steps[currentStep].description}</InfoText>
          <InfoText><strong>Distances:</strong> [{steps[currentStep].distances.map(d=>d===Infinity?'∞':d).join(', ')}]</InfoText>
        </InfoPanel>
      )}
      <InfoPanel>
        <InfoTitle>Bellman–Ford (JS)</InfoTitle>
        <CodeContainer>
          <Suspense fallback={<div>Loading code...</div>}>
            <SyntaxHighlighter language="javascript" style={vs2015}>{`function bellmanFord(edges, n, start){\n  const dist=Array(n).fill(Infinity), prev=Array(n).fill(null); dist[start]=0;\n  for(let i=1;i<=n-1;i++){\n    let updated=false;\n    for(const [u,v,w] of edges){\n      if(dist[u]!==Infinity && dist[u]+w<dist[v]){ dist[v]=dist[u]+w; prev[v]=u; updated=true; }\n    }\n    if(!updated) break;\n  }\n  for(const [u,v,w] of edges){ if(dist[u]!==Infinity && dist[u]+w<dist[v]) return {negativeCycle:true}; }\n  return {dist, prev, negativeCycle:false};\n}`}</SyntaxHighlighter>
          </Suspense>
        </CodeContainer>
      </InfoPanel>
    </PageContainer>
  );
};

export default BellmanFordPage;


