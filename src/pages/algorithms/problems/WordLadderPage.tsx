import React from 'react';
import ProblemPageTemplate from '../../../components/templates/ProblemPageTemplate';
import { AlgorithmInfo } from '../../../types/algorithm';

const wordLadderInfo: AlgorithmInfo = {
  name: "Word Ladder",
  description: "Word Ladder is a graph problem where we need to find the shortest transformation sequence from a start word to an end word, such that only one letter can be changed at a time, and each transformed word must exist in a given word list.",
  timeComplexity: {
    best: 'O(n * m^2)',
    average: 'O(n * m^2)',
    worst: 'O(n * m^2)'
  },
  spaceComplexity: 'O(n * m)',
  implementations: {
    javascript: `function ladderLength(beginWord, endWord, wordList) {
  const wordSet = new Set(wordList);
  
  // If the end word is not in the dictionary, return 0
  if (!wordSet.has(endWord)) return 0;
  
  // Create a queue for BFS
  const queue = [];
  queue.push({ word: beginWord, length: 1 });
  
  // To avoid visiting the same word again
  const visited = new Set();
  visited.add(beginWord);
  
  while (queue.length > 0) {
    const { word, length } = queue.shift();
    
    // Try changing each character of the word
    for (let i = 0; i < word.length; i++) {
      // Try replacing the character with all letters
      for (let c = 'a'.charCodeAt(0); c <= 'z'.charCodeAt(0); c++) {
        const newChar = String.fromCharCode(c);
        
        // Skip if it's the same character
        if (word[i] === newChar) continue;
        
        // Create a new word by replacing the character
        const newWord = word.slice(0, i) + newChar + word.slice(i + 1);
        
        // If we reached the end word, return the length + 1
        if (newWord === endWord) return length + 1;
        
        // If the word is in the dictionary and not visited
        if (wordSet.has(newWord) && !visited.has(newWord)) {
          visited.add(newWord);
          queue.push({ word: newWord, length: length + 1 });
        }
      }
    }
  }
  
  // If no transformation sequence is found
  return 0;
}`,
    python: `def ladder_length(begin_word, end_word, word_list):
    word_set = set(word_list)
    
    # If the end word is not in the dictionary, return 0
    if end_word not in word_set:
        return 0
    
    # Create a queue for BFS
    queue = [(begin_word, 1)]
    
    # To avoid visiting the same word again
    visited = {begin_word}
    
    while queue:
        word, length = queue.pop(0)
        
        # Try changing each character of the word
        for i in range(len(word)):
            # Try replacing the character with all letters
            for c in 'abcdefghijklmnopqrstuvwxyz':
                # Skip if it's the same character
                if word[i] == c:
                    continue
                
                # Create a new word by replacing the character
                new_word = word[:i] + c + word[i+1:]
                
                # If we reached the end word, return the length + 1
                if new_word == end_word:
                    return length + 1
                
                # If the word is in the dictionary and not visited
                if new_word in word_set and new_word not in visited:
                    visited.add(new_word)
                    queue.append((new_word, length + 1))
    
    # If no transformation sequence is found
    return 0`,
    java: `public int ladderLength(String beginWord, String endWord, List<String> wordList) {
    Set<String> wordSet = new HashSet<>(wordList);
    
    // If the end word is not in the dictionary, return 0
    if (!wordSet.contains(endWord)) return 0;
    
    // Create a queue for BFS
    Queue<Pair<String, Integer>> queue = new LinkedList<>();
    queue.offer(new Pair<>(beginWord, 1));
    
    // To avoid visiting the same word again
    Set<String> visited = new HashSet<>();
    visited.add(beginWord);
    
    while (!queue.isEmpty()) {
        Pair<String, Integer> current = queue.poll();
        String word = current.getKey();
        int length = current.getValue();
        
        // Try changing each character of the word
        for (int i = 0; i < word.length(); i++) {
            char[] wordChars = word.toCharArray();
            
            // Try replacing the character with all letters
            for (char c = 'a'; c <= 'z'; c++) {
                // Skip if it's the same character
                if (word.charAt(i) == c) continue;
                
                wordChars[i] = c;
                String newWord = new String(wordChars);
                
                // If we reached the end word, return the length + 1
                if (newWord.equals(endWord)) return length + 1;
                
                // If the word is in the dictionary and not visited
                if (wordSet.contains(newWord) && !visited.contains(newWord)) {
                    visited.add(newWord);
                    queue.offer(new Pair<>(newWord, length + 1));
                }
            }
        }
    }
    
    // If no transformation sequence is found
    return 0;
}`,
    cpp: `int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
    unordered_set<string> wordSet(wordList.begin(), wordList.end());
    
    // If the end word is not in the dictionary, return 0
    if (wordSet.find(endWord) == wordSet.end()) return 0;
    
    // Create a queue for BFS
    queue<pair<string, int>> q;
    q.push({beginWord, 1});
    
    // To avoid visiting the same word again
    unordered_set<string> visited;
    visited.insert(beginWord);
    
    while (!q.empty()) {
        auto current = q.front(); q.pop();
        string word = current.first;
        int length = current.second;
        
        // Try changing each character of the word
        for (int i = 0; i < word.size(); i++) {
            char originalChar = word[i];
            
            // Try replacing the character with all letters
            for (char c = 'a'; c <= 'z'; c++) {
                // Skip if it's the same character
                if (word[i] == c) continue;
                
                word[i] = c;
                
                // If we reached the end word, return the length + 1
                if (word == endWord) return length + 1;
                
                // If the word is in the dictionary and not visited
                if (wordSet.find(word) != wordSet.end() && visited.find(word) == visited.end()) {
                    visited.insert(word);
                    q.push({word, length + 1});
                }
            }
            
            // Revert the change
            word[i] = originalChar;
        }
    }
    
    // If no transformation sequence is found
    return 0;
}`
  }
};

const problemDescription = `
Given two words, beginWord and endWord, and a dictionary wordList, find the length of the shortest transformation sequence from beginWord to endWord.

Rules for transformation:
1. Only one letter can be changed at a time.
2. Each transformed word must exist in the wordList.
3. beginWord is not a part of wordList, but endWord is.

For example, given:
- beginWord = "hit"
- endWord = "cog"
- wordList = ["hot", "dot", "dog", "lot", "log", "cog"]

The shortest transformation sequence would be: "hit" -> "hot" -> "dot" -> "dog" -> "cog"
So the length of the shortest transformation sequence is 5.

The algorithm uses a breadth-first search (BFS) approach to find the shortest path from beginWord to endWord. For each word, it tries changing each character to every possible letter and checks if the new word exists in the dictionary and hasn't been visited yet.
`;

const WordLadderPage: React.FC = () => {
  const visualizationComponent = (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <p>Word transformation visualization will be displayed here</p>
    </div>
  );

  return (
    <ProblemPageTemplate 
      algorithmInfo={wordLadderInfo}
      visualizationComponent={visualizationComponent}
      problemDescription={problemDescription}
    />
  );
};

export default WordLadderPage; 