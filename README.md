# Data Structures and Algorithms
A collection of COMP2521 tutorial problems, my own examples and implementations of classic data structures and their algorithms in C.

## Table of Contents  
- [Interactive BST](#interactive-bst)   
- [Interactive AVL Tree](#interactive-avl)   
- [Interactive Splay Tree](#interactive-splay)  
- [Interactive Graph](#interactive-graph)  


<a name="interactive-bst"/>

## Interactive Binary Search Tree

An interactive binary search tree builder written in C. Supports standard operations such as insertion, deletion, rotation, and in-order, pre-order, post-order and level-order printing.

### Setup Instructions:
1. `git clone https://github.com/Tymotex/DataStructures.git` - downloads this repository
2. `cd DataStructures/binary-tree` - navigates to the interactive BST project root
3. `make` - creates the executable file `testTree`
4. `./testTree <space separated integers>` - initially constructs a tree from the supplied sequence of integers

Eg. `./testTree 6 3 10 1 4 8 12 7 9`

### Example Usage:
<p float="left">
  <img src="https://raw.githubusercontent.com/Tymotex/DataStructures/master/Images/interactive-bst/InteractiveBST1.png" width="50%" />
  <img src="https://raw.githubusercontent.com/Tymotex/DataStructures/master/Images/interactive-bst/InteractiveBST2.png" width="45%" />
  <img src="https://raw.githubusercontent.com/Tymotex/DataStructures/master/Images/interactive-bst/InteractiveBST3.png" width="45%" />
  <img src="https://raw.githubusercontent.com/Tymotex/DataStructures/master/Images/interactive-bst/InteractiveBST4.png" width="45%" />
</p>

### How to use this for practice:
1. Run `rm tree.c && mv tree-blank.c tree.c` to replace the main implementation file with the file containing blank functions
2. You can find all the functions that need to be implemented in the `tree.h` header file. Start by implementing the `insert` function first
3. As you implement more functions, you can test them out by running `./testTree` and then entering the relevant commands
4. If you get stuck on any function, you can check this repo for the answers


<a name="interactive-avl"/>

## Interactive AVL Tree
An interactive AVL tree builder written in C. Supports AVL insertion, AVL deletion and commands to print the height of each node and the height balance of each node.

### Setup Instructions:
1. `git clone https://github.com/Tymotex/DataStructures.git`
2. `cd DataStructures/avl-tree`
3. `make` - creates the executable file `testTree`
4. `./testTree <space separated integers>` - initially constructs an AVLtree from the supplied sequence of integers

Eg. `./testTree 1 2 3 4 5 6 7`

### Example Usage:
`./testTree 1 2 3 4 5 6 7`
<p float="left">
  <img src="https://raw.githubusercontent.com/Tymotex/DataStructures/master/Images/interactive-avl-tree/InteractiveAVL1.png" width="90%" />
  <img src="https://raw.githubusercontent.com/Tymotex/DataStructures/master/Images/interactive-avl-tree/InteractiveAVL2.png" max-width="45%" height="500px" />
  <img src="https://raw.githubusercontent.com/Tymotex/DataStructures/master/Images/interactive-avl-tree/InteractiveAVL3.png" max-width="45%" height="500px" />
</p>

<a name="interactive-splay"/>

## Interactive Splay Tree
An interactive splay tree builder written in C. Splay trees differ from regular BSTs in that searching and inserting a value involves bringing the target/inserted node to the root. 

### Setup Instructions:
1. `git clone https://github.com/Tymotex/DataStructures.git` 
2. `cd DataStructures/splay-tree` 
3. `make` - creates the executable file `testTree`
4. `./testTree <space separated integers>` - initially constructs a splay tree from the supplied sequence of integers

Eg. `./testTree 5 3 8 7 4`

<a name="interactive-graph"/>

## Interactive Graph
Interactive unweighted undirected graph builder written in C.

### Setup Instructions:
1. `git clone https://github.com/Tymotex/DataStructures.git` 
2. `cd DataStructures/graph` 
3. `make` - creates the executable file `testGraph`
4. `./testGraph <num vertices>|<input file>` - creates an empty graph with the specified number of vertices OR constructs a graph with edges specified in an input file 

Eg. `./testGraph tests/2.in`

### Example Usage:
<p float="left">
  <img src="https://raw.githubusercontent.com/Tymotex/DataStructures/master/Images/interactive-graph/InteractiveGraph1.png" width="45%" />
  <img src="https://raw.githubusercontent.com/Tymotex/DataStructures/master/Images/interactive-graph/InteractiveGraph2.png" max-width="45%" />
  <img src="https://raw.githubusercontent.com/Tymotex/DataStructures/master/Images/interactive-graph/InteractiveGraph3.png" max-width="35%" />
</p>
