import {
  ID,
  Identifiable,
  Map,
  Opt
} from '../models';

export class ArrayMap<T extends Identifiable> {
  private map: Map<T> = {};
  private array: Array<T> = [];

  public get length(): number { return this.array.length; }

  public contains(id: ID): boolean {
    return !!this.map[id];
  }

  public containsItem(item: T): boolean {
    return this.contains(item.id);
  }

  public push(item: T): number {
    if (this.containsItem(item)) {
      return this.length;
    }

    this.map[item.id] = item;
    return this.array.push(item);
  }

  public pop(): Opt<T> {
    const item: Opt<T> = this.array.pop();

    if (item) {
      delete this.map[item.id];
    }

    return item;
  }

  public remove(id: ID): boolean {
    const currentLength = this.length;

    this.array = this.array.filter((item: T) => {
      if (item.id === id) {
        delete this.map[id];
        return false;
      }

      return true;
    });

    return currentLength > this.length;
  }

  public getItem(id: ID): Opt<T> {
    return this.map[id];
  }

  public get(index: number): Opt<T> {
    if (index < 0 || index >= this.length) {
      return undefined;
    }

    return this.array[index];
  }

  public filter(
    filterCallback: (item: T) => boolean,
    onRemove?: Opt<(item: T) => void>,
    onKeep?: Opt<(item: T) => void>
  ): void {
    this.array = this.array.filter((item: T) => {
      if (filterCallback(item)) {
        if (onKeep) {
          onKeep(item);
        }
        return true;
      } else {
        delete this.map[item.id];
        if (onRemove) {
          onRemove(item);
        }
        return false;
      }
    });
  }

  public forEach(callback: (item: T, index: number, values: Array<T>) => void): void {
    this.array.forEach(callback);
  }

  public mapItems<U>(callback: (item: T, index?: number, values?: Array<T>) => U): Array<U> {
    return this.array.map(callback);
  }
}
