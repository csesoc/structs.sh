import GraphicalDataStructure from 'visualiser-src/common/GraphicalDataStructure';
import { Documentation } from 'visualiser-src/common/typedefs';
import { injectIds } from 'visualiser-src/common/helpers';
import BSTInsertAnimationProducer from '../animation-producer/BSTInsertAnimationProducer';
import BSTRotateAnimationProducer from '../animation-producer/BSTRotateAnimationProducer';
import GraphicalBSTNode from './GraphicalBSTNode';
import GraphicalTreeTraversal from './GraphicalTreeTraversal';
import updateNodePositions from '../util/helpers';

// used for the actual implementation of the bst
class GraphicalBST extends GraphicalDataStructure {
  private static documentation: Documentation = injectIds({
    insert: {
      args: ['value'],
      description:
        'Executes standard BST insertion to add a new node with the given value into the tree.',
    },
    rotateLeft: {
      args: ['value'],
      description: 'Executes a left rotation on the node with the given value.',
    },
    rotateRight: {
      args: ['value'],
      description: 'Executes a right rotation on the node with the given value.',
    },
    inorderTraversal: {
      args: [],
      description: 'Executes an inorder traversal on the tree.',
    },
    preorderTraversal: {
      args: [],
      description: 'Executes a preorder traversal on the tree.',
    },
    postorderTraversal: {
      args: [],
      description: 'Executes a postorder traversal on the tree.',
    },
  });

  public root: GraphicalBSTNode = null;

  public insert(input: number): BSTInsertAnimationProducer {
    const animationProducer: BSTInsertAnimationProducer = new BSTInsertAnimationProducer();
    if (this.root === null) {
      this.root = GraphicalBSTNode.from(input);
      updateNodePositions(this.root);
      animationProducer.doAnimation(animationProducer.createNode, this.root);
    } else {
      this.doInsert(this.root, input, animationProducer);
    }
    animationProducer.doAnimation(animationProducer.unhighlightBST, this.root);
    return animationProducer;
  }

  public inorderTraversal() {
    return GraphicalTreeTraversal.inorderTraversal(this.root);
  }

  public preorderTraversal() {
    return GraphicalTreeTraversal.preorderTraversal(this.root);
  }

  public postorderTraversal() {
    return GraphicalTreeTraversal.postorderTraversal(this.root);
  }

  // returns a node corresponding to the input
  public getNode(input: number): GraphicalBSTNode {
    // handle edgecase where no nodes are present
    if (this.root === null) return null;

    return this.getNodeRecursive(input, this.root);
  }

  // TODO: remove this
  public getNodeRecursive(input: number, node: GraphicalBSTNode): GraphicalBSTNode {
    if (node === null) return null;
    if (input === node.value) return node;

    if (input < node.value) {
      return this.getNodeRecursive(input, node.left);
    }
    return this.getNodeRecursive(input, node.right);
  }

  public rotateLeft(input: number): BSTRotateAnimationProducer {
    const animationProducer: BSTRotateAnimationProducer = new BSTRotateAnimationProducer();
    animationProducer.renderRotateLeftCode();
    const oldRoot: GraphicalBSTNode = this.getNode(input);

    if (oldRoot === null) return animationProducer;

    const newRoot: GraphicalBSTNode = oldRoot.right;

    if (newRoot === null) return animationProducer;

    this.root = this.doRotateLeft(this.root, input, animationProducer);
    updateNodePositions(this.root);
    animationProducer.doAnimationAndHighlight(
      5,
      animationProducer.updateAndUnhighlightBST,
      this.root
    );

    return animationProducer;
  }

  public doRotateLeft(
    node: GraphicalBSTNode,
    input: number,
    animationProducer: BSTRotateAnimationProducer
  ): GraphicalBSTNode {
    animationProducer.doAnimationAndHighlight(1, animationProducer.halfHighlightNode, node);
    if (input === node.value) {
      const newRoot: GraphicalBSTNode = node.right;

      if (newRoot.left != null) {
        animationProducer.doAnimationAndHighlight(
          3,
          animationProducer.movePointerToNewRootLeftChild,
          node,
          newRoot
        );
        animationProducer.doAnimationAndHighlight(
          4,
          animationProducer.moveLeftPointerToOldRoot,
          node,
          newRoot
        );
      } else {
        animationProducer.doAnimation(animationProducer.hideLine, node.rightLineTarget);
        animationProducer.doAnimationAndHighlight(
          4,
          animationProducer.assignNewRootLeftPointerToOldRoot,
          node,
          newRoot
        );
      }

      node.right = newRoot.left;
      newRoot.left = node;

      return newRoot;
    }
    if (input < node.value) {
      animationProducer.doAnimationAndHighlight(
        7,
        animationProducer.highlightLine,
        node.leftLineTarget,
        node.leftArrowTarget
      );
      node.left = this.doRotateLeft(node.left, input, animationProducer);
    } else {
      animationProducer.doAnimationAndHighlight(
        9,
        animationProducer.highlightLine,
        node.rightLineTarget,
        node.rightArrowTarget
      );
      node.right = this.doRotateLeft(node.right, input, animationProducer);
    }

    return node;
  }

  public rotateRight(input: number): BSTRotateAnimationProducer {
    const animationProducer: BSTRotateAnimationProducer = new BSTRotateAnimationProducer();
    animationProducer.renderRotateRightCode();
    const oldRoot: GraphicalBSTNode = this.getNode(input);

    if (oldRoot === null) return animationProducer;

    const newRoot: GraphicalBSTNode = oldRoot.left;

    if (newRoot === null) return animationProducer;

    this.root = this.doRotateRight(this.root, input, animationProducer);
    updateNodePositions(this.root);
    animationProducer.doAnimationAndHighlight(
      5,
      animationProducer.updateAndUnhighlightBST,
      this.root
    );

    return animationProducer;
  }

  public doRotateRight(
    node: GraphicalBSTNode,
    input: number,
    animationProducer: BSTRotateAnimationProducer
  ): GraphicalBSTNode {
    animationProducer.doAnimationAndHighlight(1, animationProducer.halfHighlightNode, node);
    if (input === node.value) {
      const newRoot: GraphicalBSTNode = node.left;

      if (newRoot.right != null) {
        animationProducer.doAnimationAndHighlight(
          3,
          animationProducer.movePointerToNewRootRightChild,
          node,
          newRoot
        );
        animationProducer.doAnimationAndHighlight(
          4,
          animationProducer.moveRightPointerToOldRoot,
          node,
          newRoot
        );
      } else {
        animationProducer.doAnimation(animationProducer.hideLine, node.leftLineTarget);
        animationProducer.doAnimationAndHighlight(
          4,
          animationProducer.assignNewRootRightPointerToOldRoot,
          node,
          newRoot
        );
      }

      node.left = newRoot.right;
      newRoot.right = node;

      return newRoot;
    }
    if (input < node.value) {
      animationProducer.doAnimationAndHighlight(
        7,
        animationProducer.highlightLine,
        node.leftLineTarget,
        node.leftArrowTarget
      );
      node.left = this.doRotateRight(node.left, input, animationProducer);
    } else {
      animationProducer.doAnimationAndHighlight(
        9,
        animationProducer.highlightLine,
        node.rightLineTarget,
        node.rightArrowTarget
      );
      node.right = this.doRotateRight(node.right, input, animationProducer);
    }

    return node;
  }

  public get documentation() {
    return GraphicalBST.documentation;
  }

  private doInsert(
    root: GraphicalBSTNode,
    input: number,
    animationProducer: BSTInsertAnimationProducer
  ) {
    animationProducer.doAnimation(animationProducer.halfHighlightNode, root);
    if (root.value > input) {
      if (root.left == null) {
        root.left = GraphicalBSTNode.from(input);
        updateNodePositions(this.root);
        animationProducer.doAnimation(animationProducer.createNodeLeft, root.left, root);
      } else {
        animationProducer.doAnimation(
          animationProducer.highlightLine,
          root.leftLineTarget,
          root.leftArrowTarget
        );
        this.doInsert(root.left, input, animationProducer);
      }
    } else if (root.value < input) {
      if (root.right == null) {
        root.right = GraphicalBSTNode.from(input);
        updateNodePositions(this.root);
        animationProducer.doAnimation(animationProducer.createNodeRight, root.right, root);
      } else {
        animationProducer.doAnimation(
          animationProducer.highlightLine,
          root.rightLineTarget,
          root.rightArrowTarget
        );
        this.doInsert(root.right, input, animationProducer);
      }
    } else {
      // highlight root red
    }
  }
}

export default GraphicalBST;
