

export class BPTreeNode {
    keys: number[] = [];
    children: BPTreeNode[] = [];
    parent: BPTreeNode = null;
    prev: BPTreeNode = null;
    next: BPTreeNode = null;
    get keyCount() {
        return this.keys.length;
    }

    get childCount() {
        return this.children.length;
    }

    get isLeaf() {
        return this.children.length == 0;
    }

    removeKey(index: number) {
        this.keys.splice(index, 1);
    }

    removeChild(index: number) {
        this.children.splice(index, 1);
    }


    insertKey(index: number, key: number) {
        this.keys.splice(index, 0, key);
    }

    pushKey(key: number) {
        this.keys.push(key);
    }

    pushChild(child: BPTreeNode) {
        this.children.push(child);
    }

    getInsertKeyIndex(key: number) {
        let i = 0;
        while (i < this.keyCount) {
            if (key < this.keys[i]) {
                break;
            } else {
                i++;
            }
        }
        return i;
    }

}


export class BPTree {
    order = 3;

    get minKeys() {
        return Math.ceil(this.order / 2) - 1;
    }
    get maxKeys() {
        return this.order - 1;
    }

    get splitIndex() {
        return Math.ceil(this.order / 2) - 1;
    }

    root: BPTreeNode = null;

    init(nums: number[]) {
        this.root = null;
        for (let i = 0; i < nums.length; i++) {
            this.insert(nums[i]);
        }
    }

    insert(key: number) {
        if (!this.root) {
            this.root = new BPTreeNode();
            this.root.insertKey(0, key)
        } else {
            this._insert(this.root, key);
        }
    }

    private _insert(root: BPTreeNode, key: number) {
        let i = 0;
        while (i < root.keyCount) {
            if (key < root.keys[i]) {
                if (root.isLeaf) {
                    root.insertKey(i, key);
                    this.insertRepair(root);
                    return;
                } else {
                    this._insert(root.children[i], key);
                    return;
                }
            } else if (key > root.keys[i]) {
                i++;
            } else { // key == root.keys[i]
                if (root.isLeaf) {// exist
                    return;
                } else {
                    this._insert(root.children[i + 1], key);
                    return;
                }
            }
        }

        if (root.isLeaf) {
            root.insertKey(i, key);
            this.insertRepair(root);
            return;
        } else {
            this._insert(root.children[i], key);
            return;
        }
    }

    private insertRepair(root: BPTreeNode) {
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

    private splitLeafNode(root: BPTreeNode) {
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
        }
    }

    private splitNotLeafNode(root: BPTreeNode) {
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
        }
    }

    private split(root: BPTreeNode): BPTreeNode {
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
        } else {
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

    delete(key: number) {
        if (this.root) {
            this._delete(this.root, key);
        }
    }

    private _delete(root: BPTreeNode, key: number) {
        let i = 0;

        while (i < root.keyCount) {
            if (key < root.keys[i]) {
                if (root.isLeaf) {
                    return; // not found
                } else {
                    this._delete(root.children[i], key);
                    return;
                }
            } else if (key > root.keys[i]) {
                i++;
            } else { // ==
                if (root.isLeaf) {
                    root.removeKey(i);
                    this.deleteRepair(root);
                    return;
                } else {
                    this._delete(root.children[i + 1], key);
                    return;
                }
            }
        }

        if (!root.isLeaf) {
            this._delete(root.children[i], key);
        } else {
            // not found
        }
    }

    private deleteRepair(root: BPTreeNode) {
        if (root.keyCount < this.minKeys) {
            if (root.parent) {
                if (root.isLeaf) {
                    this.deleteRepairLeaf(root);
                } else {
                    this.deleteRepairNotLeaf(root);
                }
            } else {
                if (root.keyCount == 0) {
                    this.root = root.children[0];
                    if (this.root) {
                        this.root.parent = null;
                    }
                }
            }
        }
    }


    private deleteRepairLeaf(root: BPTreeNode) {
        let parent = root.parent
        let nodeIndex = parent.children.indexOf(root);
        let leftSibling = nodeIndex > 0 ? parent.children[nodeIndex - 1] : null;
        let rightSibling = nodeIndex < parent.childCount - 1 ? parent.children[nodeIndex + 1] : null;

        if (leftSibling) {
            if (leftSibling.keyCount > this.minKeys) { // stealFromLeft
                this.stealFromLeftLeaf(root, nodeIndex, parent);
            } else { //mergeLeft
                this.mergeLeftLeaf(root, nodeIndex, parent);
                this.deleteRepair(parent);
            }
        } else if (rightSibling) {
            if (rightSibling.keyCount > this.minKeys) {// stealFromRight
                this.stealFromRightLeaf(root, nodeIndex, parent);
            } else { // mergeRight
                this.mergeLeftLeaf(rightSibling, nodeIndex + 1, parent);// 向右合并等于后面一个向左合并
                this.deleteRepair(parent);
            }
        }
    }
    private stealFromLeftLeaf(root: BPTreeNode, nodeIndex: number, parent: BPTreeNode) {
        let leftSibling = parent.children[nodeIndex - 1];
        let key = leftSibling.keys.pop();
        root.keys.unshift(key);
        parent.keys[nodeIndex - 1] = key;
    }
    private mergeLeftLeaf(root: BPTreeNode, nodeIndex: number, parent: BPTreeNode) {
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
    private stealFromRightLeaf(root: BPTreeNode, nodeIndex: number, parent: BPTreeNode) {
        let rightSibling = parent.children[nodeIndex + 1];
        let key = rightSibling.keys.shift();
        root.pushKey(key);
        let indexKey = rightSibling.keys[0];
        parent.keys[nodeIndex] = indexKey;
    }

    private deleteRepairNotLeaf(root: BPTreeNode) {
        let parent = root.parent
        let nodeIndex = parent.children.indexOf(root);
        let leftSibling = nodeIndex > 0 ? parent.children[nodeIndex - 1] : null;
        let rightSibling = nodeIndex < parent.childCount - 1 ? parent.children[nodeIndex + 1] : null;

        if (leftSibling) {
            if (leftSibling.keyCount > this.minKeys) { // stealFromLeft
                this.stealFromLeftNotLeaf(root, nodeIndex, parent);
            } else { //mergeLeft
                this.mergeLeftNotLeaf(root, nodeIndex, parent);
                this.deleteRepair(parent);
            }
        } else if (rightSibling) {
            if (rightSibling.keyCount > this.minKeys) {// stealFromRight
                this.stealFromRightNotLeaf(root, nodeIndex, parent);
            } else { // mergeRight
                this.mergeLeftNotLeaf(rightSibling, nodeIndex + 1, parent);// 向右合并等于后面一个向左合并
                this.deleteRepair(parent);
            }
        }
    }

    private stealFromLeftNotLeaf(root: BPTreeNode, nodeIndex: number, parent: BPTreeNode) {
        let leftSibling = parent.children[nodeIndex - 1];
        let leftKey = leftSibling.keys.pop();
        let midKey = parent.keys[nodeIndex - 1];
        parent.keys[nodeIndex - 1] = leftKey;
        root.keys.unshift(midKey);
        let leftChild = leftSibling.children.pop();
        root.children.unshift(leftChild);
    }
    private mergeLeftNotLeaf(root: BPTreeNode, nodeIndex: number, parent: BPTreeNode) {
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
    private stealFromRightNotLeaf(root: BPTreeNode, nodeIndex: number, parent: BPTreeNode) {
        let rightSibling = parent.children[nodeIndex + 1];
        let midKey = parent.keys[nodeIndex];
        let rightKey = rightSibling.keys.shift();
        parent.keys[nodeIndex] = rightKey;
        root.pushKey(midKey);
        let rightChild = rightSibling.children.shift();
        root.children.push(rightChild);
    }
}

