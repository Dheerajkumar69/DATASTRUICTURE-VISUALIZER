import React from 'react';
import ArrayPageTemplate from '../../../components/templates/ArrayPageTemplate';
import { AlgorithmInfo } from '../../../types/algorithm';

const extendedEuclideanInfo: AlgorithmInfo = {
  name: "Extended Euclidean Algorithm",
  description: "The Extended Euclidean Algorithm is an extension of the Euclidean Algorithm that computes, besides the greatest common divisor (GCD) of integers a and b, the coefficients of Bézout's identity, which are integers x and y such that ax + by = gcd(a, b).",
  timeComplexity: {
    best: 'O(1)',
    average: 'O(log(min(a, b)))',
    worst: 'O(log(min(a, b)))'
  },
  spaceComplexity: 'O(1)',
  implementations: {
    javascript: `function extendedGcd(a, b) {
  let [old_r, r] = [a, b];
  let [old_s, s] = [1, 0];
  let [old_t, t] = [0, 1];

  while (r !== 0) {
    const quotient = Math.floor(old_r / r);
    [old_r, r] = [r, old_r - quotient * r];
    [old_s, s] = [s, old_s - quotient * s];
    [old_t, t] = [t, old_t - quotient * t];
  }

  return [old_r, old_s, old_t];
}`,
    python: `def extended_gcd(a, b):
    old_r, r = a, b
    old_s, s = 1, 0
    old_t, t = 0, 1

    while r != 0:
        quotient = old_r // r
        old_r, r = r, old_r - quotient * r
        old_s, s = s, old_s - quotient * s
        old_t, t = t, old_t - quotient * t

    return old_r, old_s, old_t`,
    java: `public int[] extendedGcd(int a, int b) {
    int old_r = a, r = b;
    int old_s = 1, s = 0;
    int old_t = 0, t = 1;

    while (r != 0) {
        int quotient = old_r / r;
        int temp = r;
        r = old_r - quotient * r;
        old_r = temp;

        temp = s;
        s = old_s - quotient * s;
        old_s = temp;

        temp = t;
        t = old_t - quotient * t;
        old_t = temp;
    }

    return new int[]{old_r, old_s, old_t};
}`,
    cpp: `std::tuple<int, int, int> extendedGcd(int a, int b) {
    int old_r = a, r = b;
    int old_s = 1, s = 0;
    int old_t = 0, t = 1;

    while (r != 0) {
        int quotient = old_r / r;
        int temp = r;
        r = old_r - quotient * r;
        old_r = temp;

        temp = s;
        s = old_s - quotient * s;
        old_s = temp;

        temp = t;
        t = old_t - quotient * t;
        old_t = temp;
    }

    return {old_r, old_s, old_t};
}`
  }
};

const generateExtendedEuclideanSteps = (array: number[]): Array<{
  array: number[];
  activeIndices: number[];
  comparingIndices: number[];
  stepDescription: string;
}> => {
  const steps = [];
  let a = array[0];
  let b = array[1];
  let [old_r, r] = [a, b];
  let [old_s, s] = [1, 0];
  let [old_t, t] = [0, 1];

  // Initial step
  steps.push({
    array: [a, b],
    activeIndices: [0, 1],
    comparingIndices: [],
    stepDescription: `Starting with a = ${a}, b = ${b}`
  });

  while (r !== 0) {
    const quotient = Math.floor(old_r / r);
    
    // Show division step
    steps.push({
      array: [old_r, r],
      activeIndices: [0, 1],
      comparingIndices: [],
      stepDescription: `${old_r} = ${quotient} * ${r} + ${old_r - quotient * r}`
    });

    // Update values
    [old_r, r] = [r, old_r - quotient * r];
    [old_s, s] = [s, old_s - quotient * s];
    [old_t, t] = [t, old_t - quotient * t];
    
    // Show updated values
    steps.push({
      array: [old_r, r],
      activeIndices: [0, 1],
      comparingIndices: [],
      stepDescription: `New values: r = ${r}, s = ${s}, t = ${t}`
    });
  }

  // Final step showing result
  steps.push({
    array: [old_r, 0],
    activeIndices: [0],
    comparingIndices: [],
    stepDescription: `GCD = ${old_r}, x = ${old_s}, y = ${old_t}`
  });

  return steps;
};

const ExtendedEuclideanPage: React.FC = () => {
  return (
    <ArrayPageTemplate
      algorithmInfo={extendedEuclideanInfo}
      generateSteps={generateExtendedEuclideanSteps}
      defaultArray={[48, 18]}
    />
  );
};

export default ExtendedEuclideanPage; 