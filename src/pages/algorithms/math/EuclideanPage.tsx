import React from 'react';
import ArrayPageTemplate, { Step } from '../../../components/templates/ArrayPageTemplate';
import { AlgorithmInfo } from '../../../types/algorithm';

const euclideanInfo: AlgorithmInfo = {
  name: "Euclidean Algorithm",
  description: "The Euclidean Algorithm is an efficient method for computing the greatest common divisor (GCD) of two integers. It's based on the principle that the GCD of two numbers also divides their difference.",
  timeComplexity: {
    best: 'O(1)',
    average: 'O(log(min(a, b)))',
    worst: 'O(log(min(a, b)))'
  },
  spaceComplexity: 'O(1)',
  implementations: {
    javascript: `function gcd(a, b) {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}`,
    python: `def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a`,
    java: `public int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}`,
    cpp: `int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}`
  }
};

const generateEuclideanSteps = (array: number[]): Step[] => {
  const steps: Step[] = [];
  let a = array[0];
  let b = array[1];

  // Initial step
  steps.push({
    array: [a, b],
    activeIndices: [0, 1],
    comparingIndices: [],
    stepDescription: `Starting with a = ${a}, b = ${b}`
  });

  while (b !== 0) {
    const remainder = a % b;
    
    // Show division step
    steps.push({
      array: [a, b],
      activeIndices: [0, 1],
      comparingIndices: [],
      stepDescription: `${a} % ${b} = ${remainder}`
    });

    // Update values
    a = b;
    b = remainder;
    
    // Show updated values
    steps.push({
      array: [a, b],
      activeIndices: [0, 1],
      comparingIndices: [],
      stepDescription: `New values: a = ${a}, b = ${b}`
    });
  }

  // Final step showing result
  steps.push({
    array: [a, 0],
    activeIndices: [0],
    comparingIndices: [],
    stepDescription: `GCD is ${a}`
  });

  return steps;
};

const EuclideanPage: React.FC = () => {
  return (
    <ArrayPageTemplate
      algorithmInfo={euclideanInfo}
      generateSteps={generateEuclideanSteps}
      defaultArray={[48, 18]}
    />
  );
};

export default EuclideanPage; 