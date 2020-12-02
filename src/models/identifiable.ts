export type ID = string;

let __ID__: number = 0;

export function nextId(): ID {
  return `${__ID__++}`;
}

export interface Identifiable {
  id: ID;
}
