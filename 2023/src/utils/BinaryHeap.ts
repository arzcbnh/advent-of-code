export class BinaryHeap<T> {
    private readonly heap: T[];
    private readonly predicate: (a: T, b: T) => boolean;

    constructor(arr: T[], predicate: (a: T, b: T) => boolean) {
        this.predicate = predicate;
        this.heap = [...arr];

        for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
            this.siftDown(i);
        }
    }

    private swap(a: number, b: number): void {
        [this.heap[a], this.heap[b]] = [this.heap[b], this.heap[a]];
    }

    private bubbleUp(index = this.heap.length - 1): void {
        if (index < 1 || index >= this.heap.length) {
            return;
        }

        let curr = index;

        while (curr > 0) {
            const parent = Math.floor((curr - 1) / 2);

            if (this.predicate(this.heap[parent], this.heap[curr])) {
                break;
            }

            this.swap(curr, parent);
            curr = parent;
        }
    }

    private siftDown(index = 0): void {
        if (index >= this.heap.length - 1) {
            return;
        }

        let curr = index;
        let smallest = index;

        while (true) {
            const left = curr * 2 + 1;
            const right = left + 1;

            if (left < this.heap.length && this.predicate(this.heap[left], this.heap[smallest])) {
                smallest = left;
            }

            if (right < this.heap.length && this.predicate(this.heap[right], this.heap[smallest])) {
                smallest = right;
            }

            if (smallest === curr) {
                break;
            }

            this.swap(curr, smallest);
            curr = smallest;
        }
    }

    insert(item: T): void {
        this.heap.push(item);
        this.bubbleUp();
    }

    extract(): T | undefined {
        if (this.heap.length === 0) {
            return;
        }

        const item = this.heap[0];
        this.heap[0] = this.heap[this.heap.length - 1];
        this.heap.pop();

        if (this.heap.length > 1) {
            this.siftDown();
        }

        return item;
    }
}
