import React from 'react';
import SortingPageTemplate, { AnimationStep, SortingAlgorithmInfo } from '../../../components/templates/SortingPageTemplate';

// Pseudocode for Bubble Sort — each line maps to a 0-based index
// referenced in the AnimationStep.pseudocodeLine field.
const PSEUDOCODE = [
  { text: 'procedure bubbleSort(A : list of sortable items)', indent: 0 },  // 0
  { text: 'n := length(A)',                                    indent: 1 },  // 1
  { text: 'repeat',                                            indent: 1 },  // 2
  { text: 'swapped := false',                                  indent: 2 },  // 3
  { text: 'for i := 1 to n - 1 inclusive do',                  indent: 2 },  // 4
  { text: 'if A[i - 1] > A[i] then',                           indent: 3 },  // 5
  { text: 'swap(A[i - 1], A[i])',                              indent: 4 },  // 6
  { text: 'swapped := true',                                   indent: 4 },  // 7
  { text: 'end if',                                            indent: 3 },  // 8
  { text: 'end for',                                           indent: 2 },  // 9
  { text: 'n := n - 1',                                        indent: 2 },  // 10
  { text: 'until not swapped',                                 indent: 1 },  // 11
  { text: 'end procedure',                                     indent: 0 },  // 12
];

const bubbleSortInfo: SortingAlgorithmInfo = {
  name: 'Bubble Sort',
  description: 'Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. Each pass bubbles the largest unsorted element to its correct position. The "Early Termination" optimization stops early if no swaps occur in a pass.',
  timeComplexityBest: 'O(n)',
  timeComplexityAverage: 'O(n²)',
  timeComplexityWorst: 'O(n²)',
  spaceComplexity: 'O(1)',
  stability: 'Stable',
  pseudocode: PSEUDOCODE,
  implementations: [
    {
      language: 'javascript',
      title: 'Bubble Sort — JavaScript',
      code: `function bubbleSort(arr) {
  const n = arr.length;
  let swapped;

  do {
    swapped = false;
    for (let i = 1; i < n; i++) {
      if (arr[i - 1] > arr[i]) {
        [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
        swapped = true;
      }
    }
    // After each pass the last element is sorted
  } while (swapped);

  return arr;
}`
    },
    {
      language: 'python',
      title: 'Bubble Sort — Python',
      code: `def bubble_sort(arr):
    n = len(arr)

    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break   # Already sorted

    return arr`
    },
    {
      language: 'java',
      title: 'Bubble Sort — Java',
      code: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    boolean swapped;

    for (int i = 0; i < n - 1; i++) {
        swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`
    },
    {
      language: 'c++',
      title: 'Bubble Sort — C++',
      code: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    bool swapped;

    for (int i = 0; i < n - 1; i++) {
        swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`
    }
  ]
};

// Generate Bubble Sort steps with pseudocode line references
const generateBubbleSortSteps = (array: number[]): AnimationStep[] => {
  const steps: AnimationStep[] = [];
  const arr = [...array];
  const n = arr.length;

  // Line 0: procedure start
  steps.push({ type: 'compare', indices: [], description: 'Start Bubble Sort procedure.', pseudocodeLine: 0 });
  // Line 1: n := length(A)
  steps.push({ type: 'compare', indices: [], description: `n = ${n}`, pseudocodeLine: 1 });

  let swapped = true;
  let pass = 0;

  while (swapped) {
    // Line 2: repeat
    steps.push({ type: 'compare', indices: [], description: `Pass ${pass + 1}: begin outer loop (repeat)`, pseudocodeLine: 2 });
    swapped = false;
    // Line 3: swapped := false
    steps.push({ type: 'compare', indices: [], description: 'Set swapped = false', pseudocodeLine: 3 });

    for (let i = 1; i < n - pass; i++) {
      // Line 4: for loop
      steps.push({ type: 'compare', indices: [i - 1, i], description: `for i = ${i}: checking A[${i - 1}] and A[${i}]`, pseudocodeLine: 4 });
      // Line 5: if condition
      steps.push({ type: 'compare', indices: [i - 1, i], description: `Compare: ${arr[i - 1]} > ${arr[i]}? → ${arr[i - 1] > arr[i] ? 'Yes, swap!' : 'No, skip.'}`, pseudocodeLine: 5 });

      if (arr[i - 1] > arr[i]) {
        // Line 6: swap
        steps.push({ type: 'swap', indices: [i - 1, i], description: `Swap ${arr[i - 1]} ↔ ${arr[i]}`, pseudocodeLine: 6 });
        [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
        // Line 7: swapped := true
        steps.push({ type: 'compare', indices: [i - 1, i], description: 'swapped = true', pseudocodeLine: 7 });
        swapped = true;
      }
    }

    // Line 9-10: end for + n := n - 1 (element at end is sorted)
    steps.push({ type: 'sorted', indices: [n - 1 - pass], description: `Element ${arr[n - 1 - pass]} is now in its final sorted position.`, pseudocodeLine: 10 });
    pass++;

    // Line 11: until not swapped
    steps.push({ type: 'compare', indices: [], description: `Check: swapped = ${swapped} → ${!swapped ? 'Array sorted! Exit loop.' : 'Continue sorting.'}`, pseudocodeLine: 11 });
  }

  // Mark any remaining unsorted elements as sorted
  for (let k = 0; k < n - pass; k++) {
    steps.push({ type: 'sorted', indices: [k], description: `Element ${arr[k]} confirmed in sorted position.`, pseudocodeLine: 11 });
  }

  // Line 12: end procedure
  steps.push({ type: 'compare', indices: [], description: '🎉 Array is fully sorted!', pseudocodeLine: 12 });

  return steps;
};

const BubbleSortPage: React.FC = () => {
  return (
    <SortingPageTemplate
      algorithmInfo={bubbleSortInfo}
      generateSteps={generateBubbleSortSteps}
    />
  );
};

export default BubbleSortPage;