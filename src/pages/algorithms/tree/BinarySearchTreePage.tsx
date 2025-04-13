import React from 'react';
import TreePageTemplate, { TreeNode, TreeVisualizationStep } from '../../../components/templates/TreePageTemplate';
import { AlgorithmInfo } from '../../../types/algorithm';

// Define a sample binary search tree for visualization
const sampleBST: TreeNode = {
  value: 15,
  left: {
    value: 10,
    left: {
      value: 8,
      left: {
        value: 6
      },
      right: {
        value: 9
      }
    },
    right: {
      value: 12,
      left: {
        value: 11
      }
    }
  },
  right: {
    value: 25,
    left: {
      value: 20,
      left: {
        value: 17
      },
      right: {
        value: 22
      }
    },
    right: {
      value: 30,
      left: {
        value: 27
      }
    }
  }
};

// Define algorithm information
const binarySearchTreeInfo: AlgorithmInfo = {
  name: "Binary Search Tree",
  description: "A Binary Search Tree (BST) is a node-based binary tree data structure that has the following properties: The left subtree of a node contains only nodes with keys less than the node's key. The right subtree of a node contains only nodes with keys greater than the node's key. Both the left and right subtrees are also binary search trees. This structure allows for efficient operations like search, insertion, and deletion, typically with O(log n) complexity in balanced trees.",
  timeComplexity: {
    best: "O(log n) for search, insert, and delete (balanced tree)",
    average: "O(log n) for search, insert, and delete",
    worst: "O(n) for search, insert, and delete (skewed tree)"
  },
  spaceComplexity: "O(n) for storing the tree. O(h) for recursive operations, where h is the height of the tree.",
  implementations: {
    javascript: `class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  
  // Insert a value into the BST
  insert(value) {
    const newNode = new TreeNode(value);
    
    if (this.root === null) {
      this.root = newNode;
      return this;
    }
    
    let current = this.root;
    
    while (true) {
      if (value === current.value) return undefined; // No duplicates
      
      if (value < current.value) {
        if (current.left === null) {
          current.left = newNode;
          return this;
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = newNode;
          return this;
        }
        current = current.right;
      }
    }
  }
  
  // Search for a value in the BST
  search(value) {
    if (this.root === null) return false;
    
    let current = this.root;
    let found = false;
    
    while (current && !found) {
      if (value < current.value) {
        current = current.left;
      } else if (value > current.value) {
        current = current.right;
      } else {
        found = true;
      }
    }
    
    return found ? current : false;
  }
  
  // Delete a value from the BST
  delete(value) {
    this.root = this._deleteNode(this.root, value);
    return this;
  }
  
  _deleteNode(root, value) {
    if (root === null) return null;
    
    if (value < root.value) {
      root.left = this._deleteNode(root.left, value);
    } else if (value > root.value) {
      root.right = this._deleteNode(root.right, value);
    } else {
      // Case 1: Leaf node (no children)
      if (root.left === null && root.right === null) {
        return null;
      }
      
      // Case 2: Node with only one child
      if (root.left === null) {
        return root.right;
      }
      if (root.right === null) {
        return root.left;
      }
      
      // Case 3: Node with two children
      // Find the minimum value in the right subtree
      let successor = this._findMin(root.right);
      root.value = successor.value;
      
      // Delete the successor
      root.right = this._deleteNode(root.right, successor.value);
    }
    
    return root;
  }
  
  _findMin(node) {
    while (node.left !== null) {
      node = node.left;
    }
    return node;
  }
}`,
    python: `class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self):
        self.root = None
    
    # Insert a value into the BST
    def insert(self, value):
        if self.root is None:
            self.root = TreeNode(value)
            return
            
        current = self.root
        
        while True:
            if value == current.value:
                return  # No duplicates
            
            if value < current.value:
                if current.left is None:
                    current.left = TreeNode(value)
                    return
                current = current.left
            else:
                if current.right is None:
                    current.right = TreeNode(value)
                    return
                current = current.right
    
    # Search for a value in the BST
    def search(self, value):
        current = self.root
        
        while current:
            if value == current.value:
                return True
            
            if value < current.value:
                current = current.left
            else:
                current = current.right
                
        return False
    
    # Delete a value from the BST
    def delete(self, value):
        self.root = self._delete_node(self.root, value)
        
    def _delete_node(self, root, value):
        if root is None:
            return None
            
        if value < root.value:
            root.left = self._delete_node(root.left, value)
        elif value > root.value:
            root.right = self._delete_node(root.right, value)
        else:
            # Case 1: Leaf node (no children)
            if root.left is None and root.right is None:
                return None
                
            # Case 2: Node with only one child
            if root.left is None:
                return root.right
            if root.right is None:
                return root.left
                
            # Case 3: Node with two children
            # Find the minimum value in the right subtree
            successor = self._find_min(root.right)
            root.value = successor.value
            
            # Delete the successor
            root.right = self._delete_node(root.right, successor.value)
            
        return root
        
    def _find_min(self, node):
        current = node
        while current.left:
            current = current.left
        return current`,
    java: `class TreeNode {
    int value;
    TreeNode left;
    TreeNode right;
    
    public TreeNode(int value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    TreeNode root;
    
    public BinarySearchTree() {
        this.root = null;
    }
    
    // Insert a value into the BST
    public void insert(int value) {
        if (root == null) {
            root = new TreeNode(value);
            return;
        }
        
        TreeNode current = root;
        
        while (true) {
            if (value == current.value) {
                return; // No duplicates
            }
            
            if (value < current.value) {
                if (current.left == null) {
                    current.left = new TreeNode(value);
                    return;
                }
                current = current.left;
            } else {
                if (current.right == null) {
                    current.right = new TreeNode(value);
                    return;
                }
                current = current.right;
            }
        }
    }
    
    // Search for a value in the BST
    public boolean search(int value) {
        TreeNode current = root;
        
        while (current != null) {
            if (value == current.value) {
                return true;
            }
            
            if (value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        
        return false;
    }
    
    // Delete a value from the BST
    public void delete(int value) {
        root = deleteNode(root, value);
    }
    
    private TreeNode deleteNode(TreeNode root, int value) {
        if (root == null) {
            return null;
        }
        
        if (value < root.value) {
            root.left = deleteNode(root.left, value);
        } else if (value > root.value) {
            root.right = deleteNode(root.right, value);
        } else {
            // Case 1: Leaf node (no children)
            if (root.left == null && root.right == null) {
                return null;
            }
            
            // Case 2: Node with only one child
            if (root.left == null) {
                return root.right;
            }
            if (root.right == null) {
                return root.left;
            }
            
            // Case 3: Node with two children
            // Find the minimum value in the right subtree
            TreeNode successor = findMin(root.right);
            root.value = successor.value;
            
            // Delete the successor
            root.right = deleteNode(root.right, successor.value);
        }
        
        return root;
    }
    
    private TreeNode findMin(TreeNode node) {
        TreeNode current = node;
        while (current.left != null) {
            current = current.left;
        }
        return current;
    }
}`,
    cpp: `struct TreeNode {
    int value;
    TreeNode* left;
    TreeNode* right;
    
    TreeNode(int val) : value(val), left(nullptr), right(nullptr) {}
};

class BinarySearchTree {
private:
    TreeNode* root;
    
    TreeNode* deleteNode(TreeNode* root, int value) {
        if (root == nullptr) return nullptr;
        
        if (value < root->value) {
            root->left = deleteNode(root->left, value);
        } else if (value > root->value) {
            root->right = deleteNode(root->right, value);
        } else {
            // Case 1: Leaf node (no children)
            if (root->left == nullptr && root->right == nullptr) {
                delete root;
                return nullptr;
            }
            
            // Case 2: Node with only one child
            if (root->left == nullptr) {
                TreeNode* temp = root->right;
                delete root;
                return temp;
            }
            if (root->right == nullptr) {
                TreeNode* temp = root->left;
                delete root;
                return temp;
            }
            
            // Case 3: Node with two children
            // Find the minimum value in the right subtree
            TreeNode* successor = findMin(root->right);
            root->value = successor->value;
            
            // Delete the successor
            root->right = deleteNode(root->right, successor->value);
        }
        
        return root;
    }
    
    TreeNode* findMin(TreeNode* node) {
        TreeNode* current = node;
        while (current->left != nullptr) {
            current = current->left;
        }
        return current;
    }
    
public:
    BinarySearchTree() : root(nullptr) {}
    
    ~BinarySearchTree() {
        // Clean up code to delete all nodes (not shown)
    }
    
    // Insert a value into the BST
    void insert(int value) {
        if (root == nullptr) {
            root = new TreeNode(value);
            return;
        }
        
        TreeNode* current = root;
        
        while (true) {
            if (value == current->value) {
                return; // No duplicates
            }
            
            if (value < current->value) {
                if (current->left == nullptr) {
                    current->left = new TreeNode(value);
                    return;
                }
                current = current->left;
            } else {
                if (current->right == nullptr) {
                    current->right = new TreeNode(value);
                    return;
                }
                current = current->right;
            }
        }
    }
    
    // Search for a value in the BST
    bool search(int value) {
        TreeNode* current = root;
        
        while (current != nullptr) {
            if (value == current->value) {
                return true;
            }
            
            if (value < current->value) {
                current = current->left;
            } else {
                current = current->right;
            }
        }
        
        return false;
    }
    
    // Delete a value from the BST
    void remove(int value) {
        root = deleteNode(root, value);
    }
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

// Generate steps for visualizing BST search
const generateSearchSteps = (root: TreeNode, valueToFind: number = 17): TreeVisualizationStep[] => {
  const steps: TreeVisualizationStep[] = [];
  const visitedNodes: number[] = [];
  
  // Add initial step
  steps.push({
    tree: cloneTree(root) as TreeNode,
    currentNode: null,
    visitedNodes: [],
    description: `Starting search for value ${valueToFind} in the BST. We'll compare with each node and go left if the target is smaller, right if it's larger.`
  });

  // Helper function to perform BST search with visualization steps
  const search = (node: TreeNode | undefined, path: string = ""): boolean => {
    if (!node) {
      steps.push({
        tree: cloneTree(root) as TreeNode,
        currentNode: null,
        visitedNodes: [...visitedNodes],
        description: `${path}Node is null. Value ${valueToFind} not found in this path.`
      });
      return false;
    }
    
    // Visit current node
    visitedNodes.push(node.value);
    steps.push({
      tree: cloneTree(root) as TreeNode,
      currentNode: node.value,
      visitedNodes: [...visitedNodes],
      description: `${path}Comparing target value ${valueToFind} with current node value ${node.value}.`
    });
    
    // If found the value
    if (valueToFind === node.value) {
      steps.push({
        tree: cloneTree(root) as TreeNode,
        currentNode: node.value,
        visitedNodes: [...visitedNodes],
        description: `${path}Found the target value ${valueToFind}!`
      });
      return true;
    }
    
    // If value is less than node, go left
    if (valueToFind < node.value) {
      steps.push({
        tree: cloneTree(root) as TreeNode,
        currentNode: node.value,
        visitedNodes: [...visitedNodes],
        description: `${path}Value ${valueToFind} is less than ${node.value}, moving to the left subtree.`
      });
      return search(node.left, path + "  ");
    }
    
    // If value is greater than node, go right
    steps.push({
      tree: cloneTree(root) as TreeNode,
      currentNode: node.value,
      visitedNodes: [...visitedNodes],
      description: `${path}Value ${valueToFind} is greater than ${node.value}, moving to the right subtree.`
    });
    return search(node.right, path + "  ");
  };
  
  // Perform the search
  const found = search(root);
  
  // Add final step
  steps.push({
    tree: cloneTree(root) as TreeNode,
    currentNode: null,
    visitedNodes: [...visitedNodes],
    description: `Search complete. Value ${valueToFind} ${found ? 'was found' : 'was not found'} in the BST.`
  });
  
  return steps;
};

// Generate steps for visualizing BST insertion
const generateInsertSteps = (root: TreeNode, valueToInsert: number = 21): TreeVisualizationStep[] => {
  const steps: TreeVisualizationStep[] = [];
  const visitedNodes: number[] = [];
  
  // Add initial step
  steps.push({
    tree: cloneTree(root) as TreeNode,
    currentNode: null,
    visitedNodes: [],
    description: `Starting insertion of value ${valueToInsert} into the BST. We'll navigate to the correct position based on BST property.`
  });

  // Helper function to perform BST insertion with visualization steps
  const insert = (originalTree: TreeNode, node: TreeNode | undefined, path: string = ""): TreeNode => {
    // Create a new node if we've reached a null position
    if (!node) {
      const newNode: TreeNode = { value: valueToInsert };
      
      steps.push({
        tree: cloneTree(originalTree) as TreeNode,
        currentNode: valueToInsert,
        visitedNodes: [...visitedNodes],
        description: `${path}Found the correct position. Inserting new node with value ${valueToInsert}.`
      });
      
      return newNode;
    }
    
    // Visit current node
    visitedNodes.push(node.value);
    steps.push({
      tree: cloneTree(originalTree) as TreeNode,
      currentNode: node.value,
      visitedNodes: [...visitedNodes],
      description: `${path}Comparing insertion value ${valueToInsert} with current node value ${node.value}.`
    });
    
    // If value already exists in the tree, do nothing (no duplicates)
    if (valueToInsert === node.value) {
      steps.push({
        tree: cloneTree(originalTree) as TreeNode,
        currentNode: node.value,
        visitedNodes: [...visitedNodes],
        description: `${path}Value ${valueToInsert} already exists in the tree. No insertion needed.`
      });
      return cloneTree(node) as TreeNode;
    }
    
    // Create a clone of the current node to avoid modifying the original tree
    const newNode = cloneTree(node) as TreeNode;
    
    // If value is less than node, insert in left subtree
    if (valueToInsert < node.value) {
      steps.push({
        tree: cloneTree(originalTree) as TreeNode,
        currentNode: node.value,
        visitedNodes: [...visitedNodes],
        description: `${path}Value ${valueToInsert} is less than ${node.value}, moving to the left subtree.`
      });
      
      newNode.left = insert(originalTree, node.left, path + "  ");
    } else { // If value is greater than node, insert in right subtree
      steps.push({
        tree: cloneTree(originalTree) as TreeNode,
        currentNode: node.value,
        visitedNodes: [...visitedNodes],
        description: `${path}Value ${valueToInsert} is greater than ${node.value}, moving to the right subtree.`
      });
      
      newNode.right = insert(originalTree, node.right, path + "  ");
    }
    
    return newNode;
  };
  
  // Perform the insertion and get the modified tree
  const updatedTree = insert(root, cloneTree(root) as TreeNode);
  
  // Add final step with the updated tree
  steps.push({
    tree: updatedTree,
    currentNode: null,
    visitedNodes: [...visitedNodes],
    description: `Insertion complete. Value ${valueToInsert} has been inserted into the BST.`
  });
  
  return steps;
};

// Combine all BST operations
const generateBSTSteps = (root: TreeNode): TreeVisualizationStep[] => {
  // By default, use search operation
  return generateSearchSteps(root);
};

const BinarySearchTreePage: React.FC = () => {
  return (
    <TreePageTemplate
      algorithmInfo={binarySearchTreeInfo}
      initialTree={sampleBST}
      generateSteps={generateBSTSteps}
    />
  );
};

export default BinarySearchTreePage; 