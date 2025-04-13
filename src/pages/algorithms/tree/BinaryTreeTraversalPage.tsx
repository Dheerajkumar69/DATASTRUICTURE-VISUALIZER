import React from 'react';
import TreePageTemplate, { TreeNode, TreeVisualizationStep } from '../../../components/templates/TreePageTemplate';
import { AlgorithmInfo } from '../../../types/algorithm';

// Define a sample binary tree for visualization
const sampleTree: TreeNode = {
  value: 10,
  left: {
    value: 5,
    left: {
      value: 3,
      left: {
        value: 1
      },
      right: {
        value: 4
      }
    },
    right: {
      value: 7,
      left: {
        value: 6
      },
      right: {
        value: 8
      }
    }
  },
  right: {
    value: 15,
    left: {
      value: 13,
      left: {
        value: 11
      },
      right: {
        value: 14
      }
    },
    right: {
      value: 18,
      left: {
        value: 16
      },
      right: {
        value: 19
      }
    }
  }
};

// Define algorithm information
const binaryTreeTraversalInfo: AlgorithmInfo = {
  name: "Binary Tree Traversals",
  description: "Binary tree traversal is the process of visiting each node in a binary tree exactly once. There are three common traversal methods: In-order (left, root, right), Pre-order (root, left, right), and Post-order (left, right, root). These traversals are fundamental operations for processing tree data structures and have various applications in programming.",
  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)"
  },
  spaceComplexity: "O(h) where h is the height of the tree (due to recursion stack). In the worst case of a skewed tree, this becomes O(n).",
  implementations: {
    javascript: `// In-order Traversal (Left, Root, Right)
function inOrderTraversal(root) {
  const result = [];
  
  function traverse(node) {
    if (node === null) return;
    
    // First recur on left child
    traverse(node.left);
    
    // Then visit the node
    result.push(node.value);
    
    // Finally recur on right child
    traverse(node.right);
  }
  
  traverse(root);
  return result;
}

// Pre-order Traversal (Root, Left, Right)
function preOrderTraversal(root) {
  const result = [];
  
  function traverse(node) {
    if (node === null) return;
    
    // First visit the node
    result.push(node.value);
    
    // Then recur on left child
    traverse(node.left);
    
    // Finally recur on right child
    traverse(node.right);
  }
  
  traverse(root);
  return result;
}

// Post-order Traversal (Left, Right, Root)
function postOrderTraversal(root) {
  const result = [];
  
  function traverse(node) {
    if (node === null) return;
    
    // First recur on left child
    traverse(node.left);
    
    // Then recur on right child
    traverse(node.right);
    
    // Finally visit the node
    result.push(node.value);
  }
  
  traverse(root);
  return result;
}`,
    python: `# In-order Traversal (Left, Root, Right)
def in_order_traversal(root):
    result = []
    
    def traverse(node):
        if node is None:
            return
            
        # First recur on left child
        traverse(node.left)
        
        # Then visit the node
        result.append(node.value)
        
        # Finally recur on right child
        traverse(node.right)
    
    traverse(root)
    return result

# Pre-order Traversal (Root, Left, Right)
def pre_order_traversal(root):
    result = []
    
    def traverse(node):
        if node is None:
            return
            
        # First visit the node
        result.append(node.value)
        
        # Then recur on left child
        traverse(node.left)
        
        # Finally recur on right child
        traverse(node.right)
    
    traverse(root)
    return result

# Post-order Traversal (Left, Right, Root)
def post_order_traversal(root):
    result = []
    
    def traverse(node):
        if node is None:
            return
            
        # First recur on left child
        traverse(node.left)
        
        # Then recur on right child
        traverse(node.right)
        
        # Finally visit the node
        result.append(node.value)
    
    traverse(root)
    return result`,
    java: `// In-order Traversal (Left, Root, Right)
public List<Integer> inOrderTraversal(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    inOrderHelper(root, result);
    return result;
}

private void inOrderHelper(TreeNode node, List<Integer> result) {
    if (node == null) return;
    
    // First recur on left child
    inOrderHelper(node.left, result);
    
    // Then visit the node
    result.add(node.val);
    
    // Finally recur on right child
    inOrderHelper(node.right, result);
}

// Pre-order Traversal (Root, Left, Right)
public List<Integer> preOrderTraversal(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    preOrderHelper(root, result);
    return result;
}

private void preOrderHelper(TreeNode node, List<Integer> result) {
    if (node == null) return;
    
    // First visit the node
    result.add(node.val);
    
    // Then recur on left child
    preOrderHelper(node.left, result);
    
    // Finally recur on right child
    preOrderHelper(node.right, result);
}

// Post-order Traversal (Left, Right, Root)
public List<Integer> postOrderTraversal(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    postOrderHelper(root, result);
    return result;
}

private void postOrderHelper(TreeNode node, List<Integer> result) {
    if (node == null) return;
    
    // First recur on left child
    postOrderHelper(node.left, result);
    
    // Then recur on right child
    postOrderHelper(node.right, result);
    
    // Finally visit the node
    result.add(node.val);
}`,
    cpp: `// In-order Traversal (Left, Root, Right)
void inOrderTraversal(TreeNode* root, vector<int>& result) {
    if (root == nullptr) return;
    
    // First recur on left child
    inOrderTraversal(root->left, result);
    
    // Then visit the node
    result.push_back(root->val);
    
    // Finally recur on right child
    inOrderTraversal(root->right, result);
}

// Pre-order Traversal (Root, Left, Right)
void preOrderTraversal(TreeNode* root, vector<int>& result) {
    if (root == nullptr) return;
    
    // First visit the node
    result.push_back(root->val);
    
    // Then recur on left child
    preOrderTraversal(root->left, result);
    
    // Finally recur on right child
    preOrderTraversal(root->right, result);
}

// Post-order Traversal (Left, Right, Root)
void postOrderTraversal(TreeNode* root, vector<int>& result) {
    if (root == nullptr) return;
    
    // First recur on left child
    postOrderTraversal(root->left, result);
    
    // Then recur on right child
    postOrderTraversal(root->right, result);
    
    // Finally visit the node
    result.push_back(root->val);
}`
  }
};

// Clone a tree structure so we can modify it without affecting the original
const cloneTree = (node: TreeNode | undefined): TreeNode | undefined => {
  if (!node) return undefined;
  
  return {
    value: node.value,
    left: cloneTree(node.left),
    right: cloneTree(node.right)
  };
};

// Generate steps for visualizing in-order traversal
const generateInOrderSteps = (root: TreeNode): TreeVisualizationStep[] => {
  const steps: TreeVisualizationStep[] = [];
  const visitedNodes: number[] = [];
  
  // Add initial step
  steps.push({
    tree: cloneTree(root) as TreeNode,
    currentNode: null,
    visitedNodes: [],
    description: "Starting in-order traversal. We'll visit nodes in the pattern: Left subtree → Root → Right subtree."
  });

  // Helper function to generate in-order traversal steps
  const traverse = (node: TreeNode | undefined, path: string = ""): void => {
    if (!node) return;
    
    // Visit left subtree first
    if (node.left) {
      steps.push({
        tree: cloneTree(root) as TreeNode,
        currentNode: node.value,
        visitedNodes: [...visitedNodes],
        description: `${path}Moving to left child of node ${node.value}.`
      });
      
      traverse(node.left, path + "  ");
    }
    
    // Visit the current node
    visitedNodes.push(node.value);
    steps.push({
      tree: cloneTree(root) as TreeNode,
      currentNode: node.value,
      visitedNodes: [...visitedNodes],
      description: `${path}Visiting node ${node.value}.`
    });
    
    // Visit right subtree last
    if (node.right) {
      steps.push({
        tree: cloneTree(root) as TreeNode,
        currentNode: node.value,
        visitedNodes: [...visitedNodes],
        description: `${path}Moving to right child of node ${node.value}.`
      });
      
      traverse(node.right, path + "  ");
    }
  };
  
  traverse(root);
  
  // Add final step
  steps.push({
    tree: cloneTree(root) as TreeNode,
    currentNode: null,
    visitedNodes: [...visitedNodes],
    description: `In-order traversal complete. Result: [${visitedNodes.join(", ")}]`
  });
  
  return steps;
};

// Generate steps for visualizing pre-order traversal
const generatePreOrderSteps = (root: TreeNode): TreeVisualizationStep[] => {
  const steps: TreeVisualizationStep[] = [];
  const visitedNodes: number[] = [];
  
  // Add initial step
  steps.push({
    tree: cloneTree(root) as TreeNode,
    currentNode: null,
    visitedNodes: [],
    description: "Starting pre-order traversal. We'll visit nodes in the pattern: Root → Left subtree → Right subtree."
  });

  // Helper function to generate pre-order traversal steps
  const traverse = (node: TreeNode | undefined, path: string = ""): void => {
    if (!node) return;
    
    // Visit the current node first
    visitedNodes.push(node.value);
    steps.push({
      tree: cloneTree(root) as TreeNode,
      currentNode: node.value,
      visitedNodes: [...visitedNodes],
      description: `${path}Visiting node ${node.value}.`
    });
    
    // Visit left subtree
    if (node.left) {
      steps.push({
        tree: cloneTree(root) as TreeNode,
        currentNode: node.value,
        visitedNodes: [...visitedNodes],
        description: `${path}Moving to left child of node ${node.value}.`
      });
      
      traverse(node.left, path + "  ");
    }
    
    // Visit right subtree
    if (node.right) {
      steps.push({
        tree: cloneTree(root) as TreeNode,
        currentNode: node.value,
        visitedNodes: [...visitedNodes],
        description: `${path}Moving to right child of node ${node.value}.`
      });
      
      traverse(node.right, path + "  ");
    }
  };
  
  traverse(root);
  
  // Add final step
  steps.push({
    tree: cloneTree(root) as TreeNode,
    currentNode: null,
    visitedNodes: [...visitedNodes],
    description: `Pre-order traversal complete. Result: [${visitedNodes.join(", ")}]`
  });
  
  return steps;
};

// Generate steps for visualizing post-order traversal
const generatePostOrderSteps = (root: TreeNode): TreeVisualizationStep[] => {
  const steps: TreeVisualizationStep[] = [];
  const visitedNodes: number[] = [];
  
  // Add initial step
  steps.push({
    tree: cloneTree(root) as TreeNode,
    currentNode: null,
    visitedNodes: [],
    description: "Starting post-order traversal. We'll visit nodes in the pattern: Left subtree → Right subtree → Root."
  });

  // Helper function to generate post-order traversal steps
  const traverse = (node: TreeNode | undefined, path: string = ""): void => {
    if (!node) return;
    
    // Visit left subtree first
    if (node.left) {
      steps.push({
        tree: cloneTree(root) as TreeNode,
        currentNode: node.value,
        visitedNodes: [...visitedNodes],
        description: `${path}Moving to left child of node ${node.value}.`
      });
      
      traverse(node.left, path + "  ");
    }
    
    // Visit right subtree next
    if (node.right) {
      steps.push({
        tree: cloneTree(root) as TreeNode,
        currentNode: node.value,
        visitedNodes: [...visitedNodes],
        description: `${path}Moving to right child of node ${node.value}.`
      });
      
      traverse(node.right, path + "  ");
    }
    
    // Visit the current node last
    visitedNodes.push(node.value);
    steps.push({
      tree: cloneTree(root) as TreeNode,
      currentNode: node.value,
      visitedNodes: [...visitedNodes],
      description: `${path}Visiting node ${node.value}.`
    });
  };
  
  traverse(root);
  
  // Add final step
  steps.push({
    tree: cloneTree(root) as TreeNode,
    currentNode: null,
    visitedNodes: [...visitedNodes],
    description: `Post-order traversal complete. Result: [${visitedNodes.join(", ")}]`
  });
  
  return steps;
};

// Combine all traversal types
const generateTreeTraversalSteps = (root: TreeNode): TreeVisualizationStep[] => {
  // By default, use in-order traversal
  return generateInOrderSteps(root);
};

const BinaryTreeTraversalPage: React.FC = () => {
  return (
    <TreePageTemplate
      algorithmInfo={binaryTreeTraversalInfo}
      initialTree={sampleTree}
      generateSteps={generateTreeTraversalSteps}
    />
  );
};

export default BinaryTreeTraversalPage; 