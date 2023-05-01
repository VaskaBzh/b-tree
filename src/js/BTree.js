class BTreeNode {
  constructor(t, leaf = false) {
    this.t = t; // минимальная степень (минимальное количество ключей)
    this.keys = []; // ключи
    this.children = []; // дочерние узлы
    this.leaf = leaf; // является ли узел листом
  }
}

export default class BTree {
  constructor(t) {
    this.root = null;
    this.t = t;
  }

  remove(k) {
    if (this.root === null) {
      return;
    }

    this._remove(this.root, k);

    if (this.root.keys.length === 0 && !this.root.leaf) {
      this.root = this.root.children[0];
    }
  }

  findChildIndex(node, key) {
    const idx = node?.keys.findIndex((k) => k >= key);

    if (idx !== -1) {
      return idx;
    } else {
      console.log(node)
      return this.findChildIndex(node.children[1], key);
    }
  }

  _remove(x, k) {
    const t = this.t;
    const idx = this.findChildIndex(x, k);

    if (idx < x.keys.length && x.keys[idx] === k) {
      if (x.leaf) {
        x.keys.splice(idx, 1);
      } else {
        const y = x.children[idx];
        const z = x.children[idx + 1];

        if (y.keys.length >= t) {
          const kPred = this._maximumKey(y);
          x.keys[idx] = kPred;
          this._remove(y, kPred);
        } else if (z.keys.length >= t) {
          const kSucc = this._minimumKey(z);
          x.keys[idx] = kSucc;
          this._remove(z, kSucc);
        } else {
          this._merge(x, idx);
          this._remove(y, k);
        }
      }
    } else {
      if (x.leaf) {
        return;
      }

      const child = x.children[idx];
      const sibling = idx > 0 ? x.children[idx - 1] : x.children[idx + 1];

      if (child.keys.length === t - 1) {
        if (idx > 0 && sibling.keys.length >= t) {
          child.keys.unshift(x.keys[idx - 1]);
          x.keys[idx - 1] = sibling.keys.pop();

          if (!sibling.leaf) {
            child.children.unshift(sibling.children.pop());
          }
        } else if (idx < x.keys.length && sibling.keys.length >= t) {
          child.keys.push(x.keys[idx]);
          x.keys[idx] = sibling.keys.shift();

          if (!sibling.leaf) {
            child.children.push(sibling.children.shift());
          }
        } else {
          if (idx > 0) {
            this._merge(x, idx - 1);
          } else {
            this._merge(x, idx);
          }
        }
      }

      this._remove(x.children[idx], k);
    }
  }

  _merge(x, idx) {
    const child = x.children[idx];
    const sibling = x.children[idx + 1];

    child.keys.push(x.keys[idx]);
    child.keys = child.keys.concat(sibling.keys);

    if (!child.leaf) {
      child.children = child.children.concat(sibling.children);
    }

    x.keys.splice(idx, 1);
    x.children.splice(idx + 1, 1);
  }

  _maximumKey(x) {
    while (!x.leaf) {
      x = x.children[x.keys.length];
    }
    return x.keys[x.keys.length - 1];
  }

  _minimumKey(x) {
    while (!x.leaf) {
      x = x.children[0];
    }
    return x.keys[0];
  }

  search(k) {
    return this._search(this.root, k);
  }

  _search(x, k) {
    if (x === null) {
      return null;
    }

    let i = 0;
    while (i < x.keys.length && k > x.keys[i]) {
      i++;
    }

    if (i < x.keys.length && k === x.keys[i]) {
      return { node: x, index: i };
    } else if (x.leaf) {
      return null;
    } else {
      return this._search(x.children[i], k);
    }
  }

  insert(k) {
    if (this.root === null) {
      this.root = new BTreeNode(this.t, true);
      this.root.keys[0] = k;
    } else {
      if (this.root.keys.length === 2 * this.t - 1) {
        const s = new BTreeNode(this.t, false);
        s.children[0] = this.root;
        this._splitChild(s, 0);
        this.root = s;
      }
      this._insertNonFull(this.root, k);
    }
  }

  _splitChild(x, i) {
    const t = this.t;
    const y = x.children[i];
    const z = new BTreeNode(t, y.leaf);

    z.keys = y.keys.slice(t);
    y.keys.length = t;

    if (!y.leaf) {
      z.children = y.children.slice(t);
      y.children.length = t;
    }

    x.children.splice(i + 1, 0, z);
    x.keys.splice(i, 0, y.keys[t - 1]);
    y.keys.length = t - 1;
  }

  _insertNonFull(x, k) {
    let i = x.keys.length - 1;

    if (x.leaf) {
      while (i >= 0 && k < x.keys[i]) {
        x.keys[i + 1] = x.keys[i];
        i--;
      }
      x.keys[i + 1] = k;
    } else {
      while (i >= 0 && k < x.keys[i]) {
        i--;
      }
      i++;

      if (x.children[i].keys.length === 2 * this.t - 1) {
        this._splitChild(x, i);

        if (k > x.keys[i]) {
          i++;
        }
      }

      this._insertNonFull(x.children[i], k);
    }
  }
}