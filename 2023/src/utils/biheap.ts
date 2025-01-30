export class BinaryHeap<T> {
    private readonly heap: T[];
    private readonly predicate: (a: T, b: T) => boolean;

    constructor(arr: T[], predicate: (a: T, b: T) => boolean) {
        this.predicate = predicate;
        this.heap = arr.map(x => x);
        this.heapify();
    }

    private heapify(): void {
        for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
            let smallest = i;
            let curr = i;

            do {
                this.swap(curr, smallest);
                curr = smallest;

                const left = curr * 2 + 1;
                const right = left + 1;

                if (left < this.heap.length && this.predicate(this.heap[left], this.heap[smallest])) {
                    smallest = left;
                }

                if (right < this.heap.length && this.predicate(this.heap[right], this.heap[smallest])) {
                    smallest = right;
                }
            } while (smallest !== curr);
        }
    }

    private swap(a: number, b: number): void {
        [this.heap[a], this.heap[b]] = [this.heap[b], this.heap[a]];
    }

    // insert(key: T): void {
    //     this.heap.push(key);
    //
    //     let i = this.heap.length - 1;
    //     let parent = Math.floor((i - 1) / 2);
    //
    //     while (this.predicate(this.heap[i], this.heap[parent])) {
    //         this.swap(i, parent);
    //         i = parent;
    //         parent = Math.floor((i - 1) / 2);
    //     }
    // }

    remove(): T | null {
        const smallest = this.heap[0];
        const largest = this.heap.pop();

        if (largest != null && this.heap.length > 2) {
            this.heap[0] = largest;

            let i = 0;
            let left = 1;
            let right = 2;

            while (this.heap[left] && (this.predicate(this.heap[left], this.heap[i]) || this.predicate(this.heap[right], this.heap[i]))) {
                const lesser = this.heap[right] == null || this.predicate(this.heap[left], this.heap[right]) ? left : right;
                this.swap(i, lesser);

                i = lesser;
                left = i * 2 + 1;
                right = left + 1;
            }
        } else if (largest != null && this.heap.length === 2) {
            this.heap[0] = largest;

            if (this.predicate(this.heap[1], largest)) {
                this.swap(0, 1);
            }
        } else if (largest != null && this.heap.length === 1) {
            this.heap[0] = largest;
        }

        return smallest;
    }

    // delete(key: T): void {
    //     let i = this.heap.indexOf(key);
    //     this.swap(i, this.heap.length - 1);
    //     this.heap.pop();
    //
    //     if (this.heap.length > 2) {
    //         let left = 1;
    //         let right = 2;
    //
    //         while (this.heap[left] && (this.predicate(this.heap[left], this.heap[i]) || this.predicate(this.heap[right], this.heap[i]))) {
    //             const lesser = this.heap[right] == null || this.predicate(this.heap[left], this.heap[right]) ? left : right;
    //             this.swap(i, lesser);
    //
    //             i = lesser;
    //             left = i * 2 + 1;
    //             right = left + 1;
    //         }
    //     } else if (this.heap.length === 2) {
    //         if (this.predicate(this.heap[1], this.heap[0])) {
    //             this.swap(0, 1);
    //         }
    //     }
    // }

    // downHeapify(key: T): void {
    //     let i = this.heap.indexOf(key);
    //     let left = i * 2 + 1;
    //     let right = left + 1;
    //
    //     while (this.heap[left] && (this.predicate(this.heap[left], this.heap[i]) || this.predicate(this.heap[right], this.heap[i]))) {
    //         const lesser = this.heap[right] == null || this.predicate(this.heap[left], this.heap[right]) ? left : right;
    //         this.swap(i, lesser);
    //
    //         i = lesser;
    //         left = i * 2 + 1;
    //         right = left + 1;
    //     }
    // }

    upHeapify(key: T): void {
        let i = this.heap.indexOf(key);
        let parent = Math.floor((i - 1) / 2);

        while (this.predicate(this.heap[i], this.heap[parent])) {
            this.swap(i, parent);
            i = parent;
            parent = Math.floor((i - 1) / 2);
        }
    }
}
