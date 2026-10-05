class BTreeNode {
    constructor(leaf = true) {
        this.keys = [];
        this.children = [];
        this.leaf = leaf;
    }
}

class BTree {
    constructor(t) {
        this.t = t; // Minimum degree
        this.root = new BTreeNode(true);
    }

    // Search for a key
    search(node, key) {
        let i = 0;

        while (i < node.keys.length && key > node.keys[i]) {
            i++;
        }

        if (i < node.keys.length && key === node.keys[i]) {
            return true;
        }

        if (node.leaf) {
            return false;
        }

        return this.search(node.children[i], key);
    }

    // Insert a key
    insert(key) {
        let root = this.root;

        // If root is full
        if (root.keys.length === 2 * this.t - 1) {
            let newRoot = new BTreeNode(false);

            newRoot.children.push(root);

            this.splitChild(newRoot, 0);

            this.root = newRoot;

            this.insertNonFull(newRoot, key);
        } else {
            this.insertNonFull(root, key);
        }
    }

    // Insert into a non-full node
    insertNonFull(node, key) {
        let i = node.keys.length - 1;

        if (node.leaf) {

            // Move larger keys one position ahead
            node.keys.push(null);

            while (i >= 0 && key < node.keys[i]) {
                node.keys[i + 1] = node.keys[i];
                i--;
            }

            node.keys[i + 1] = key;

        } else {

            // Find the child where key should go
            while (i >= 0 && key < node.keys[i]) {
                i--;
            }

            i++;

            // If child is full, split it
            if (node.children[i].keys.length === 2 * this.t - 1) {

                this.splitChild(node, i);

                // Decide which child to insert into
                if (key > node.keys[i]) {
                    i++;
                }
            }

            this.insertNonFull(node.children[i], key);
        }
    }

    // Split a full child
    splitChild(parent, index) {
        const t = this.t;
        const fullChild = parent.children[index];

        const newChild = new BTreeNode(fullChild.leaf);

        // Middle key moves to parent
        const middleKey = fullChild.keys[t - 1];

        // Keys after middle go to new child
        newChild.keys = fullChild.keys.splice(t);

        // Remove middle key from old child
        fullChild.keys.splice(t - 1, 1);

        // If not leaf, split children too
        if (!fullChild.leaf) {
            newChild.children = fullChild.children.splice(t);
        }

        // Add new child
        parent.children.splice(index + 1, 0, newChild);

        // Move middle key to parent
        parent.keys.splice(index, 0, middleKey);
    }

    // Display the tree
    display(node = this.root, level = 0) {

        console.log(
            "Level " + level + ": [" + node.keys.join(", ") + "]"
        );

        if (!node.leaf) {
            for (let child of node.children) {
                this.display(child, level + 1);
            }
        }
    }
}


// ==========================
// Example
// ==========================

const tree = new BTree(2);

// Insert values
const values = [
    10, 20, 5, 6,
    12, 30, 7, 17
];

for (let value of values) {
    tree.insert(value);
}

// Display B-Tree
tree.display();


// Search
console.log("Search 12:", tree.search(tree.root, 12));
console.log("Search 25:", tree.search(tree.root, 25));
