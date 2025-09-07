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
const InputGroup = styled.div`display:flex; align-items:center; gap:.5rem; margin-bottom:1rem;`;
const Label = styled.label`font-size:.9rem; color:${p=>p.theme.colors.textLight};`;
const Input = styled.input`padding:.5rem; border:1px solid ${p=>p.theme.colors.border}; border-radius:${p=>p.theme.borderRadius}; background:${p=>p.theme.colors.card}; color:${p=>p.theme.colors.text}; width:60px;`;
const MatrixContainer = styled.div`overflow:auto; max-width:800px; border:1px solid ${p=>p.theme.colors.border}; border-radius:.5rem;`;
const Table = styled.table`border-collapse:collapse; width:100%;`;
const Th = styled.th`border:1px solid ${p=>p.theme.colors.border}; padding:.5rem; background:${p=>p.theme.colors.background}; color:${p=>p.theme.colors.text};`;
const Td = styled.td<{highlight?:boolean}>`border:1px solid ${p=>p.theme.colors.border}; padding:.5rem; text-align:center; background:${p=>p.highlight?p.theme.colors.hover:p.theme.colors.card}; color:${p=>p.theme.colors.text};`;
const InfoPanel = styled.div`padding:1rem; background:${p=>p.theme.colors.card}; border-radius:.5rem; border:1px solid ${p=>p.theme.colors.border}; margin:1rem 0; max-width:800px;`;
const InfoTitle = styled.h3`margin-bottom:.5rem; color:${p=>p.theme.colors.text}; font-size:1.1rem;`;
const InfoText = styled.p`color:${p=>p.theme.colors.textLight}; margin-bottom:.5rem; font-size:.9rem;`;
const CodeContainer = styled.div`max-width:800px; border-radius:.5rem; overflow:hidden; margin-top:1rem; width:100%;`;

interface Step { k:number; i:number; j:number; dist:number[][]; description:string }

const FloydWarshallPage: React.FC = () => {
  const [n, setN] = useState(6);
  const [matrix, setMatrix] = useState<number[][]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(500);

  useEffect(()=>{ generateRandomMatrix(); }, [n]);
  useEffect(()=>{ let t: NodeJS.Timeout; if(isAnimating && !isPaused && current<steps.length-1){ t=setTimeout(()=>setCurrent(p=>p+1), speed);} else if(current>=steps.length-1){ setIsAnimating(false);} return ()=>{ if(t) clearTimeout(t);} }, [isAnimating,isPaused,current,steps,speed]);

  const generateRandomMatrix = () => {
    const INF = Infinity; const m:number[][]=[];
    for(let i=0;i<n;i++){ m[i]=[]; for(let j=0;j<n;j++){ if(i===j) m[i][j]=0; else if(Math.random()<0.4) m[i][j]=INF; else m[i][j]=Math.floor(Math.random()*9)+1; } }
    setMatrix(m); setSteps([]); setCurrent(0);
  };

  const runFloydWarshall = () => {
    const INF = Infinity; const dist = matrix.map(row=>row.slice()); const s:Step[]=[];
    s.push({k:-1,i:-1,j:-1,dist:dist.map(r=>r.slice()), description:'Initialize distance matrix'});
    for(let k=0;k<n;k++){
      for(let i=0;i<n;i++){
        for(let j=0;j<n;j++){
          const throughK = (dist[i][k]===INF || dist[k][j]===INF) ? INF : dist[i][k]+dist[k][j];
          const before = dist[i][j];
          if(throughK < dist[i][j]) dist[i][j]=throughK;
          s.push({k,i,j,dist:dist.map(r=>r.slice()), description: throughK<before ? `Update dist[${i}][${j}] via ${k} to ${dist[i][j]}` : `Keep dist[${i}][${j}] = ${dist[i][j]}`});
        }
      }
    }
    setSteps(s); setCurrent(0);
  };

  const start = () => { if(steps.length===0) runFloydWarshall(); setIsAnimating(true); setIsPaused(false); };
  const pause = () => setIsPaused(true);
  const reset = () => { setIsAnimating(false); setIsPaused(false); setCurrent(0); };
  const fwd = () => { if(current<steps.length-1) setCurrent(p=>p+1); };
  const back = () => { if(current>0) setCurrent(p=>p-1); };

  const fwCode = `function floydWarshall(dist){\n  const n=dist.length;\n  for(let k=0;k<n;k++) for(let i=0;i<n;i++) for(let j=0;j<n;j++)\n    if(dist[i][k]+dist[k][j] < dist[i][j]) dist[i][j]=dist[i][k]+dist[k][j];\n  return dist;\n}`;

  const step = steps[current];

  return (
    <PageContainer>
      <NavigationRow>
        <BackButton to="/algorithms/graph"><FaArrowLeft/> Back to Graph Algorithms</BackButton>
      </NavigationRow>
      <PageHeader>
        <PageTitle>Floyd–Warshall (All-Pairs Shortest Paths)</PageTitle>
        <Description>Dynamic programming algorithm computing shortest paths between all pairs. Handles negative edges (no negative cycles).</Description>
      </PageHeader>
      <InfoPanel>
        <InfoTitle>Settings</InfoTitle>
        <InputGroup>
          <Label>Nodes:</Label>
          <Input type="number" min="3" max="10" value={n} onChange={e=>setN(parseInt(e.target.value,10)||6)} />
          <Button onClick={generateRandomMatrix}><FaRandom/> Regenerate</Button>
        </InputGroup>
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
      </InfoPanel>
      <MatrixContainer>
        <Table>
          <thead>
            <tr>
              <Th></Th>
              {Array.from({length:n},(_,j)=>(<Th key={j}>j={j}</Th>))}
            </tr>
          </thead>
          <tbody>
            {Array.from({length:n},(_,i)=>(
              <tr key={i}>
                <Th>i={i}</Th>
                {Array.from({length:n},(_,j)=>{
                  const val = step ? step.dist[i][j] : (matrix[i]?.[j] ?? Infinity);
                  const isHL = step && step.i===i && step.j===j;
                  return <Td key={j} highlight={isHL}>{val===Infinity?'∞':val}</Td>;
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </MatrixContainer>
      <InfoPanel>
        <InfoTitle>Implementation</InfoTitle>
        <CodeContainer>
          <Suspense fallback={<div>Loading code...</div>}>
            <SyntaxHighlighter language="javascript" style={vs2015}>{fwCode}</SyntaxHighlighter>
          </Suspense>
        </CodeContainer>
      </InfoPanel>
    </PageContainer>
  );
};

export default FloydWarshallPage;


