import { BPTree } from "./bplustree";


setTimeout(() => {
    let bpTree = new BPTree();
    bpTree.order = 5;

    {
        bpTree.init([5, 8, 10, 15, 16, 17, 18, 19, 20, 21, 22, 6, 9, 7]);
        bpTree.delete(10); // test stealFromLeftLeaf

        bpTree.init([5, 8, 10, 15, 16, 17, 18, 19, 20, 21, 22, 6, 9, 7]);
        bpTree.delete(18); // test mergeLeftLeaf

        bpTree.init([5, 8, 10, 15, 16, 17, 18, 19, 20, 21, 22, 6, 9, 7]);
        bpTree.delete(5); // test stealFromRightLeaf

        bpTree.init([5, 8, 10, 15, 16, 17, 18, 19, 20, 21, 22, 6, 9, 7]);
        bpTree.delete(16);// test mergeRightLeaf
    }

    {
        bpTree.init([5, 8, 10, 15, 16, 17, 18, 19, 20, 21, 22, 6, 9, 7]);
        bpTree.delete(18); // test mergeLeftNotLeaf

        bpTree.init([5, 8, 10, 15, 16, 17, 18, 19, 20, 21, 22, 6, 9, 7]);
        bpTree.delete(7);
        bpTree.delete(5); // test mergeRightNotLeaf
    }
    {
        bpTree.init([5, 8, 10, 15, 16, 17, 18, 19, 20, 21, 22, 6, 9, 7, 3, 2, 1]);
        bpTree.delete(16); // test stealFromLeftNotLeaf
    }
    {
        bpTree.init([5, 8, 10, 15, 16, 17, 18, 19, 20, 21, 22, 6, 9, 7, 23, 24]);
        bpTree.delete(7);
        bpTree.delete(5); // test stealFromRightNotLeaf
    }
}, 1000);