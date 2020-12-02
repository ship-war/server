export interface Map<T = any> {
  [key: string]: T;
}

export type Nullable<T> = T | null;
export type NullableString = Nullable<string>;
export type NullableNumber = Nullable<number>;
export type NullableBoolean = Nullable<boolean>;

export type Opt<T> = T | undefined;
export type OptString = Opt<string>;
export type OptNumber = Opt<number>;
export type OptBoolean = Opt<boolean>;

export type EventType = 'ENTITY_DIE';
