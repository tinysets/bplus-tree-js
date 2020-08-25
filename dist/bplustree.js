"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BPTreeNode {
    constructor() {
        this.keys = [];
        this.children = [];
        this.parent = null;
        this.prev = null;
        this.next = null;
    }
    get keyCount() {
        return this.keys.length;
    }
    get childCount() {
        return this.children.length;
    }
    get isLeaf() {
        return this.children.length == 0;
    }
    removeKey(index) {
        this.keys.splice(index, 1);
    }
    removeChild(index) {
        this.children.splice(index, 1);
    }
    insertKey(index, key) {
        this.keys.splice(index, 0, key);
    }
    pushKey(key) {
        this.keys.push(key);
    }
    pushChild(child) {
        this.children.push(child);
    }
    getInsertKeyIndex(key) {
        let i = 0;
        while (i < this.keyCount) {
            if (key < this.keys[i]) {
                break;
            }
            else {
                i++;
            }
        }
        return i;
    }
}
exports.BPTreeNode = BPTreeNode;
class BPTree {
    constructor() {
        this.order = 3;
        this.root = null;
    }
    get minKeys() {
        return Math.ceil(this.order / 2) - 1;
    }
    get maxKeys() {
        return this.order - 1;
    }
    get splitIndex() {
        return Math.ceil(this.order / 2) - 1;
    }
    init(nums) {
        this.root = null;
        for (let i = 0; i < nums.length; i++) {
            this.insert(nums[i]);
        }
    }
    insert(key) {
        if (!this.root) {
            this.root = new BPTreeNode();
            this.root.insertKey(0, key);
        }
        else {
            this._insert(this.root, key);
        }
    }
    _insert(root, key) {
        let i = 0;
        while (i < root.keyCount) {
            if (key < root.keys[i]) {
                if (root.isLeaf) {
                    root.insertKey(i, key);
                    this.insertRepair(root);
                    return;
                }
                else {
                    this._insert(root.children[i], key);
                    return;
                }
            }
            else if (key > root.keys[i]) {
                i++;
            }
            else { // key == root.keys[i]
                if (root.isLeaf) { // exist
                    return;
                }
                else {
                    this._insert(root.children[i + 1], key);
                    return;
                }
            }
        }
        if (root.isLeaf) {
            root.insertKey(i, key);
            this.insertRepair(root);
            return;
        }
        else {
            this._insert(root.children[i], key);
            return;
        }
    }
    insertRepair(root) {
        if (root.keyCount > this.maxKeys) {
            if (root.parent == null) {
                this.root = this.split(root);
            }
            else {
                var parent = this.split(root);
                this.insertRepair(parent);
            }
        }
    }
    splitLeafNode(root) {
        let midKey = root.keys[this.splitIndex];
        let leftNode = new BPTreeNode();
        let rightNode = new BPTreeNode();
        for (let i = 0; i <= this.splitIndex - 1; i++) {
            leftNode.pushKey(root.keys[i]);
        }
        for (let i = this.splitIndex; i < root.keyCount; i++) {
            rightNode.pushKey(root.keys[i]);
        }
        return {
            midKey,
            leftNode,
            rightNode
        };
    }
    splitNotLeafNode(root) {
        let midKey = root.keys[this.splitIndex];
        let leftNode = new BPTreeNode();
        let rightNode = new BPTreeNode();
        for (let i = 0; i <= this.splitIndex - 1; i++) {
            leftNode.pushKey(root.keys[i]);
            leftNode.pushChild(root.children[i]);
        }
        leftNode.pushChild(root.children[this.splitIndex]);
        for (const c of leftNode.children) {
            c.parent = leftNode;
        }
        for (let i = this.splitIndex + 1; i < root.keyCount; i++) {
            rightNode.pushKey(root.keys[i]);
            rightNode.pushChild(root.children[i]);
        }
        rightNode.pushChild(root.children[root.childCount - 1]);
        for (const c of rightNode.children) {
            c.parent = rightNode;
        }
        return {
            midKey,
            leftNode,
            rightNode
        };
    }
    split(root) {
        let parent = root.parent || new BPTreeNode();
        if (root.isLeaf) {
            let { midKey, leftNode, rightNode } = this.splitLeafNode(root);
            let prev = root.prev;
            let next = root.next;
            let childIndex = parent.children.indexOf(root);
            if (childIndex != -1) {
                parent.children.splice(childIndex, 1);
            }
            let keyIndex = parent.getInsertKeyIndex(midKey);
            parent.keys.splice(keyIndex, 0, midKey);
            parent.children.splice(keyIndex, 0, leftNode, rightNode);
            leftNode.parent = parent;
            rightNode.parent = parent;
            leftNode.next = rightNode;
            rightNode.prev = leftNode;
            if (prev) {
                prev.next = leftNode;
                leftNode.prev = prev;
            }
            if (next) {
                next.prev = rightNode;
                rightNode.next = next;
            }
        }
        else {
            let { midKey, leftNode, rightNode } = this.splitNotLeafNode(root);
            let childIndex = parent.children.indexOf(root);
            if (childIndex != -1) {
                parent.children.splice(childIndex, 1);
            }
            let keyIndex = parent.getInsertKeyIndex(midKey);
            parent.keys.splice(keyIndex, 0, midKey);
            parent.children.splice(keyIndex, 0, leftNode, rightNode);
            leftNode.parent = parent;
            rightNode.parent = parent;
        }
        return parent;
    }
    delete(key) {
        if (this.root) {
            this._delete(this.root, key);
        }
    }
    _delete(root, key) {
        let i = 0;
        while (i < root.keyCount) {
            if (key < root.keys[i]) {
                if (root.isLeaf) {
                    return; // not found
                }
                else {
                    this._delete(root.children[i], key);
                    return;
                }
            }
            else if (key > root.keys[i]) {
                i++;
            }
            else { // ==
                if (root.isLeaf) {
                    root.removeKey(i);
                    this.deleteRepair(root);
                    return;
                }
                else {
                    this._delete(root.children[i + 1], key);
                    return;
                }
            }
        }
        if (!root.isLeaf) {
            this._delete(root.children[i], key);
        }
        else {
            // not found
        }
    }
    deleteRepair(root) {
        if (root.keyCount < this.minKeys) {
            if (root.parent) {
                if (root.isLeaf) {
                    this.deleteRepairLeaf(root);
                }
                else {
                    this.deleteRepairNotLeaf(root);
                }
            }
            else {
                if (root.keyCount == 0) {
                    this.root = root.children[0];
                    if (this.root) {
                        this.root.parent = null;
                    }
                }
            }
        }
    }
    deleteRepairLeaf(root) {
        let parent = root.parent;
        let nodeIndex = parent.children.indexOf(root);
        let leftSibling = nodeIndex > 0 ? parent.children[nodeIndex - 1] : null;
        let rightSibling = nodeIndex < parent.childCount - 1 ? parent.children[nodeIndex + 1] : null;
        if (leftSibling) {
            if (leftSibling.keyCount > this.minKeys) { // stealFromLeft
                this.stealFromLeftLeaf(root, nodeIndex, parent);
            }
            else { //mergeLeft
                this.mergeLeftLeaf(root, nodeIndex, parent);
                this.deleteRepair(parent);
            }
        }
        else if (rightSibling) {
            if (rightSibling.keyCount > this.minKeys) { // stealFromRight
                this.stealFromRightLeaf(root, nodeIndex, parent);
            }
            else { // mergeRight
                this.mergeLeftLeaf(rightSibling, nodeIndex + 1, parent); // 向右合并等于后面一个向左合并
                this.deleteRepair(parent);
            }
        }
    }
    stealFromLeftLeaf(root, nodeIndex, parent) {
        let leftSibling = parent.children[nodeIndex - 1];
        let key = leftSibling.keys.pop();
        root.keys.unshift(key);
        parent.keys[nodeIndex - 1] = key;
    }
    mergeLeftLeaf(root, nodeIndex, parent) {
        let leftSibling = parent.children[nodeIndex - 1];
        let prev = root.prev;
        let next = root.next;
        for (const k of root.keys) {
            leftSibling.pushKey(k);
        }
        parent.removeKey(nodeIndex - 1);
        parent.removeChild(nodeIndex);
        if (prev) {
            prev.next = next;
        }
        if (next) {
            next.prev = prev;
        }
    }
    stealFromRightLeaf(root, nodeIndex, parent) {
        let rightSibling = parent.children[nodeIndex + 1];
        let key = rightSibling.keys.shift();
        root.pushKey(key);
        let indexKey = rightSibling.keys[0];
        parent.keys[nodeIndex] = indexKey;
    }
    deleteRepairNotLeaf(root) {
        let parent = root.parent;
        let nodeIndex = parent.children.indexOf(root);
        let leftSibling = nodeIndex > 0 ? parent.children[nodeIndex - 1] : null;
        let rightSibling = nodeIndex < parent.childCount - 1 ? parent.children[nodeIndex + 1] : null;
        if (leftSibling) {
            if (leftSibling.keyCount > this.minKeys) { // stealFromLeft
                this.stealFromLeftNotLeaf(root, nodeIndex, parent);
            }
            else { //mergeLeft
                this.mergeLeftNotLeaf(root, nodeIndex, parent);
                this.deleteRepair(parent);
            }
        }
        else if (rightSibling) {
            if (rightSibling.keyCount > this.minKeys) { // stealFromRight
                this.stealFromRightNotLeaf(root, nodeIndex, parent);
            }
            else { // mergeRight
                this.mergeLeftNotLeaf(rightSibling, nodeIndex + 1, parent); // 向右合并等于后面一个向左合并
                this.deleteRepair(parent);
            }
        }
    }
    stealFromLeftNotLeaf(root, nodeIndex, parent) {
        let leftSibling = parent.children[nodeIndex - 1];
        let leftKey = leftSibling.keys.pop();
        let midKey = parent.keys[nodeIndex - 1];
        parent.keys[nodeIndex - 1] = leftKey;
        root.keys.unshift(midKey);
        let leftChild = leftSibling.children.pop();
        root.children.unshift(leftChild);
    }
    mergeLeftNotLeaf(root, nodeIndex, parent) {
        let leftSibling = parent.children[nodeIndex - 1];
        let midKey = parent.keys[nodeIndex - 1];
        parent.removeKey(nodeIndex - 1);
        parent.removeChild(nodeIndex);
        leftSibling.pushKey(midKey);
        for (const k of root.keys) {
            leftSibling.pushKey(k);
        }
        for (const c of root.children) {
            leftSibling.pushChild(c);
        }
    }
    stealFromRightNotLeaf(root, nodeIndex, parent) {
        let rightSibling = parent.children[nodeIndex + 1];
        let midKey = parent.keys[nodeIndex];
        let rightKey = rightSibling.keys.shift();
        parent.keys[nodeIndex] = rightKey;
        root.pushKey(midKey);
        let rightChild = rightSibling.children.shift();
        root.children.push(rightChild);
    }
}
exports.BPTree = BPTree;
//# sourceMappingURL=bplustree.js.map