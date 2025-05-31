import React from 'react';
import styled from 'styled-components';

export const VisualizationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 1rem;
`;

export const GraphContainer = styled.div`
  width: 100%;
  margin-top: 1rem;
  height: 60vh;
  min-height: 400px;
  max-height: 600px;
  position: relative;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  overflow: hidden;
`;

export const Canvas = styled.canvas`
  display: block;
  width: 100%;
  height: 100%;
`;

export const StepInfo = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius};
  width: 100%;
  max-width: 800px;
  text-align: center;
`;

export const InfoPanel = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius};
  width: 100%;
  max-width: 800px;
`;

export const InfoTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

export const InfoText = styled.p`
  font-size: 0.9rem;
  line-height: 1.5;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 0.5rem;
`;

interface LegendItemProps {
  color: string;
  label: string;
}

const LegendContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.shadows.sm};
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ColorBox = styled.div<{ bgColor: string }>`
  width: 1rem;
  height: 1rem;
  background-color: ${props => props.bgColor};
  border-radius: 3px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const LegendLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
`;

export const Legend: React.FC<{ items: LegendItemProps[] }> = ({ items }) => {
  return (
    <LegendContainer>
      {items.map((item, index) => (
        <LegendItem key={index}>
          <ColorBox bgColor={item.color} />
          <LegendLabel>{item.label}</LegendLabel>
        </LegendItem>
      ))}
    </LegendContainer>
  );
};

export const ControlPanel = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  background-color: ${props => props.theme.colors.card};
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.shadows.sm};
`;

export const AlgorithmStep = styled.div`
  padding: 1rem;
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.shadows.sm};
  margin-top: 1rem;
  text-align: center;
  font-weight: 500;
`;

export const StepCounter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textLight};
`;

export const SpeedControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
`;

export const SpeedLabel = styled.label`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
`;

export const SpeedSlider = styled.input`
  width: 100px;
`;

export const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  background-color: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.text};
`;

export const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  width: 150px;
`;

export const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  width: 100%;
  min-height: 100px;
  font-family: monospace;
`; 