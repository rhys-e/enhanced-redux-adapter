# Enhanced Adapter
A RTK-ish enhanced entity adapter with additional convenience methods and optional additonal metadata

## Usage
```
interface PageState {
  id: string;
  layout: string;
}

interface DocumentMetadata {
  template: string;
}

type DocumentState = EnhancedEntityState<PageState, DocumentMetadata>;

// Create adapter with metadata type
const pageAdapter = createEnhancedAdapter<PageState, DocumentMetadata>();

let initialState: DocumentState = pageAdapter.getInitialState({
  template: "modern",
});

const newPage = {
  id: crypto.randomUUID(),
  layout: myLayoutId,
};

// with WritableDraft state 
pageAdapter.addOne(state, newPage);
```

## Methods
```
  addOne: (
    state: EnhancedEntityState<T, M>,
    entity: T
  ) => EnhancedEntityState<T, M>;
  addMany: (
    state: EnhancedEntityState<T, M>,
    entities: T[]
  ) => EnhancedEntityState<T, M>;
  setOne: (
    state: EnhancedEntityState<T, M>,
    entity: T
  ) => EnhancedEntityState<T, M>;
  setMany: (
    state: EnhancedEntityState<T, M>,
    entities: T[]
  ) => EnhancedEntityState<T, M>;
  setAll: (
    state: EnhancedEntityState<T, M>,
    entities: T[]
  ) => EnhancedEntityState<T, M>;
  removeOne: (
    state: EnhancedEntityState<T, M>,
    key: EntityId
  ) => EnhancedEntityState<T, M>;
  removeMany: (
    state: EnhancedEntityState<T, M>,
    keys: EntityId[]
  ) => EnhancedEntityState<T, M>;
  removeAll: (state: EnhancedEntityState<T, M>) => EnhancedEntityState<T, M>;
  updateOne: (
    state: EnhancedEntityState<T, M>,
    update: { id: EntityId; changes: Partial<T> }
  ) => EnhancedEntityState<T, M>;
  updateMany: (
    state: EnhancedEntityState<T, M>,
    updates: Array<{ id: EntityId; changes: Partial<T> }>
  ) => EnhancedEntityState<T, M>;
  insertAt: (
    state: EnhancedEntityState<T, M>,
    index: number,
    entity: T
  ) => EnhancedEntityState<T, M>;
  insertManyAt: (
    state: EnhancedEntityState<T, M>,
    index: number,
    entities: T[]
  ) => EnhancedEntityState<T, M>;
  swap: (
    state: EnhancedEntityState<T, M>,
    indexA: number,
    indexB: number
  ) => EnhancedEntityState<T, M>;
  swapWhere: (
    state: EnhancedEntityState<T, M>,
    predicate: (entity: T) => boolean,
    withPredicate: (entity: T) => boolean
  ) => EnhancedEntityState<T, M>;
  move: (
    state: EnhancedEntityState<T, M>,
    fromIndex: number,
    toIndex: number
  ) => EnhancedEntityState<T, M>;
  updateMetadata: (
    state: EnhancedEntityState<T, M>,
    metadata: Partial<M>
  ) => EnhancedEntityState<T, M>;
  duplicate: (
    state: EnhancedEntityState<T, M>,
    sourceId: EntityId,
    newId: EntityId
  ) => EnhancedEntityState<T, M>;
  ```
