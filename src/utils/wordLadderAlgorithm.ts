/**
 * Pure implementation of bidirectional Word Ladder algorithm
 * Separated from React component for testability and reusability
 */

export interface RejectedWord {
  word: string;
  reason: 'Not in dictionary' | 'Already visited' | string;
}

export interface QueueItem {
  word: string;
  path: string[];
  level: number;
}

export interface WordLadderStep {
  currentWord: string;
  visited: Set<string>;
  queue: QueueItem[];
  description: string;
  pathFound: boolean;
  finalPath: string[] | null;
  rejected: RejectedWord[];
}

export interface WordLadderConfig {
  maxWordListSize: number;
  maxWordLength: number;
  maxComputationSteps: number;
  onStepGenerated?: (step: WordLadderStep) => void;
}

const DEFAULT_CONFIG: WordLadderConfig = {
  maxWordListSize: 5000,
  maxWordLength: 50,
  maxComputationSteps: 10000
};

/**
 * Validates input parameters for Word Ladder algorithm
 * @throws Error with descriptive message if validation fails
 */
export function validateWordLadderInput(
  beginWord: string,
  endWord: string,
  wordList: string[],
  config: Partial<WordLadderConfig> = {}
): void {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  if (!beginWord?.trim()) {
    throw new Error('Begin word cannot be empty');
  }

  if (!endWord?.trim()) {
    throw new Error('End word cannot be empty');
  }

  if (beginWord.length !== endWord.length) {
    throw new Error(`Begin word and end word must have the same length (${beginWord.length} vs ${endWord.length})`);
  }

  if (beginWord.length > cfg.maxWordLength) {
    throw new Error(`Words cannot exceed ${cfg.maxWordLength} characters`);
  }

  if (wordList.length === 0) {
    throw new Error('Word list cannot be empty');
  }

  if (wordList.length > cfg.maxWordListSize) {
    throw new Error(`Word list cannot exceed ${cfg.maxWordListSize} words (provided: ${wordList.length})`);
  }

  if (wordList.some(w => w.length > cfg.maxWordLength)) {
    throw new Error(`All words must be at most ${cfg.maxWordLength} characters`);
  }

  if (!wordList.includes(endWord)) {
    throw new Error('End word must exist in the word list');
  }
}

/**
 * Finds shortest transformation sequence from beginWord to endWord using bidirectional BFS.
 * 
 * Algorithm:
 * - Performs simultaneous BFS from both beginWord and endWord
 * - Terminates when searches meet at a common word
 * - More efficient than unidirectional BFS (O(b^(d/2)) vs O(b^d))
 * 
 * Time Complexity: O(n * m^2 * 26) where n = word list size, m = word length
 * Space Complexity: O(n * m) for visited sets and paths
 * 
 * @param beginWord - Starting word
 * @param endWord - Target word  
 * @param wordList - Dictionary of valid words
 * @param config - Optional configuration with limits and callbacks
 * @returns Array of visualization steps showing algorithm progress
 * @throws Error if input validation fails or computation exceeds limits
 */
export function findWordLadder(
  beginWord: string,
  endWord: string,
  wordList: string[],
  config: Partial<WordLadderConfig> = {}
): WordLadderStep[] {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  // Validate input
  validateWordLadderInput(beginWord, endWord, wordList, cfg);

  const steps: WordLadderStep[] = [];
  const wordSet = new Set(wordList);

  // Initialize BFS from start side
  const startQueue: QueueItem[] = [{ word: beginWord, path: [beginWord], level: 1 }];

  // Initialize BFS from end side
  const endQueue: QueueItem[] = [{ word: endWord, path: [endWord], level: 1 }];

  // Maps to store visited words and their paths
  // startVisited: words reached from beginWord with path from start → word
  // endVisited: words reached from endWord with path from word → end (stored forward, not reversed)
  const startVisited = new Map<string, string[]>();
  startVisited.set(beginWord, [beginWord]);

  const endVisited = new Map<string, string[]>();
  endVisited.set(endWord, [endWord]);

  // Track rejected words separately to avoid memory overhead in every step
  const rejectedSet = new Set<string>();

  // Store computed allVisited to avoid reconstructing on every step
  let allVisited = new Set<string>([beginWord, endWord]);

  // Keep track of the shortest path found
  let shortestPath: string[] | null = null;

  // Initial step
  steps.push({
    currentWord: beginWord,
    visited: new Set(allVisited),
    queue: [...startQueue],
    description: `Starting bidirectional BFS between "${beginWord}" and "${endWord}". Searching from both ends simultaneously.`,
    pathFound: false,
    finalPath: null,
    rejected: []
  });

  // Bidirectional BFS main loop
  while (startQueue.length > 0 && endQueue.length > 0) {
    // Check step limit to prevent infinite loops and excessive memory
    if (steps.length >= cfg.maxComputationSteps) {
      steps.push({
        currentWord: beginWord,
        visited: new Set(allVisited),
        queue: [],
        description: `Computation aborted after ${cfg.maxComputationSteps} steps to prevent performance issues. No path found within limit.`,
        pathFound: false,
        finalPath: null,
        rejected: Array.from(rejectedSet).map(word => ({
          word,
          reason: 'Not in dictionary'
        }))
      });
      console.warn(`[WordLadder] Computation exceeded max steps: ${cfg.maxComputationSteps}`);
      return steps;
    }

    // Process one level from start side
    const startLevelSize = startQueue.length;

    for (let i = 0; i < startLevelSize; i++) {
      const item = startQueue.shift();
      if (!item) break;

      const { word, path, level } = item;

      // Skip if we've already found a shorter path
      if (shortestPath !== null && path.length >= shortestPath.length) {
        continue;
      }

      // Try changing each character
      for (let j = 0; j < word.length; j++) {
        for (let charCode = 'a'.charCodeAt(0); charCode <= 'z'.charCodeAt(0); charCode++) {
          const newChar = String.fromCharCode(charCode);

          // Skip if same character
          if (word[j] === newChar) continue;

          // Build new word efficiently
          const newWord = word.slice(0, j) + newChar + word.slice(j + 1);

          // Skip if already visited from start side
          if (startVisited.has(newWord)) continue;

          // Check if word is valid
          if (!wordSet.has(newWord) && newWord !== endWord) {
            rejectedSet.add(newWord);
            continue;
          }

          const newPath = [...path, newWord];

          // Check if word has been visited from end side - MEETING POINT DETECTED
          if (endVisited.has(newWord)) {
            // endVisited stores path forward from endWord
            // e.g., if endWord = "cog", and we came to "dot", path might be ["cog", "dog", "dot"]
            // We need to reverse it to get the path from dot → cog = ["dot", "dog", "cog"]
            const endPath = endVisited.get(newWord)!;
            
            // fullPath = [beginWord, ..., newWord] + [newWord, ..., endWord]
            // Since newWord appears in both, we slice the endPath to avoid duplication
            const fullPath = [...newPath, ...endPath.slice(1).reverse()];

            if (shortestPath === null || fullPath.length < shortestPath.length) {
              shortestPath = fullPath;
              console.log(`[WordLadder] Meeting point found at "${newWord}", path length: ${fullPath.length}`);

              steps.push({
                currentWord: newWord,
                visited: new Set([...startVisited.keys(), ...endVisited.keys()]),
                queue: [],
                description: `Meeting point found at "${newWord}"! Shortest path: ${fullPath.join(' → ')} (length: ${fullPath.length})`,
                pathFound: true,
                finalPath: fullPath,
                rejected: Array.from(rejectedSet).map(w => ({
                  word: w,
                  reason: 'Not in dictionary'
                }))
              });
            }

            // Don't return immediately - continue to ensure we find the truly shortest path
            break;
          }

          // Add to queue and mark as visited
          startQueue.push({ word: newWord, path: newPath, level: level + 1 });
          startVisited.set(newWord, newPath);
          allVisited.add(newWord);

          // Record step (but limit frequency to prevent explosion)
          if (steps.length % 50 === 0 || steps.length < 10) {
            steps.push({
              currentWord: newWord,
              visited: new Set(allVisited),
              queue: [...startQueue.slice(0, 20), ...endQueue.slice(0, 20)],
              description: `From start side: Discovered "${newWord}" at level ${level + 1}. Explored ${startVisited.size + endVisited.size} words total.`,
              pathFound: false,
              finalPath: null,
              rejected: Array.from(rejectedSet).map(w => ({
                word: w,
                reason: 'Not in dictionary'
              }))
            });
          }

          // Early exit if we found a path and we're done with this level
          if (shortestPath !== null && i === startLevelSize - 1) {
            return steps;
          }
        }
      }
    }

    // Early return if path found
    if (shortestPath !== null) {
      return steps;
    }

    // Process one level from end side
    const endLevelSize = endQueue.length;

    for (let i = 0; i < endLevelSize; i++) {
      const item = endQueue.shift();
      if (!item) break;

      const { word, path, level } = item;

      // Skip if we've already found a shorter path
      if (shortestPath !== null && path.length >= shortestPath.length) {
        continue;
      }

      // Try changing each character
      for (let j = 0; j < word.length; j++) {
        for (let charCode = 'a'.charCodeAt(0); charCode <= 'z'.charCodeAt(0); charCode++) {
          const newChar = String.fromCharCode(charCode);

          // Skip if same character
          if (word[j] === newChar) continue;

          // Build new word efficiently
          const newWord = word.slice(0, j) + newChar + word.slice(j + 1);

          // Skip if already visited from end side
          if (endVisited.has(newWord)) continue;

          // Check if word is valid
          if (!wordSet.has(newWord) && newWord !== beginWord) {
            rejectedSet.add(newWord);
            continue;
          }

          // Path is stored forward (towards endWord)
          const newPath = [newWord, ...path];

          // Check if word has been visited from start side - MEETING POINT DETECTED
          if (startVisited.has(newWord)) {
            // startVisited stores path from beginWord
            // e.g., ["hit", "hot", "dot", "dog", newWord]
            // endVisited/newPath stores path towards endWord starting at newWord
            // e.g., [newWord, "dog", "log", "cog"]
            const startPath = startVisited.get(newWord)!;
            
            // fullPath = [beginWord, ..., newWord] + [newWord, ..., endWord]
            // Avoid duplication by slicing
            const fullPath = [...startPath, ...newPath.slice(1)];

            if (shortestPath === null || fullPath.length < shortestPath.length) {
              shortestPath = fullPath;
              console.log(`[WordLadder] Meeting point found at "${newWord}", path length: ${fullPath.length}`);

              steps.push({
                currentWord: newWord,
                visited: new Set([...startVisited.keys(), ...endVisited.keys()]),
                queue: [],
                description: `Meeting point found at "${newWord}"! Shortest path: ${fullPath.join(' → ')} (length: ${fullPath.length})`,
                pathFound: true,
                finalPath: fullPath,
                rejected: Array.from(rejectedSet).map(w => ({
                  word: w,
                  reason: 'Not in dictionary'
                }))
              });
            }

            break;
          }

          // Add to queue and mark as visited
          endQueue.push({ word: newWord, path: newPath, level: level + 1 });
          endVisited.set(newWord, newPath);
          allVisited.add(newWord);

          // Record step (but limit frequency)
          if (steps.length % 50 === 0 || steps.length < 10) {
            steps.push({
              currentWord: newWord,
              visited: new Set(allVisited),
              queue: [...startQueue.slice(0, 20), ...endQueue.slice(0, 20)],
              description: `From end side: Discovered "${newWord}" at level ${level + 1}. Explored ${startVisited.size + endVisited.size} words total.`,
              pathFound: false,
              finalPath: null,
              rejected: Array.from(rejectedSet).map(w => ({
                word: w,
                reason: 'Not in dictionary'
              }))
            });
          }

          // Early exit if we found a path and we're done with this level
          if (shortestPath !== null && i === endLevelSize - 1) {
            return steps;
          }
        }
      }
    }

    // Early return if path found
    if (shortestPath !== null) {
      return steps;
    }
  }

  // No path found
  console.log(`[WordLadder] No transformation sequence found from "${beginWord}" to "${endWord}"`);
  steps.push({
    currentWord: beginWord,
    visited: new Set([...startVisited.keys(), ...endVisited.keys()]),
    queue: [],
    description: `No transformation sequence found from "${beginWord}" to "${endWord}". Explored ${startVisited.size + endVisited.size} words.`,
    pathFound: false,
    finalPath: null,
    rejected: Array.from(rejectedSet).map(w => ({
      word: w,
      reason: 'Not in dictionary'
    }))
  });

  return steps;
}
