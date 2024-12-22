// Define our own types to avoid RTK typing issues
type EntityId = string;
type Dictionary<T> = Record<EntityId, T>;

export interface EnhancedEntityState<T, M = never> {
  ids: EntityId[];
  entities: Dictionary<T>;
  metadata?: M;
}

export interface EnhancedEntityAdapter<T, M = never> {
  // Standard adapter methods
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

  // Enhanced methods
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

  getSelectors: () => {
    selectIds: (state: EnhancedEntityState<T, M>) => EntityId[];
    selectEntities: (state: EnhancedEntityState<T, M>) => Dictionary<T>;
    selectAll: (state: EnhancedEntityState<T, M>) => T[];
    selectTotal: (state: EnhancedEntityState<T, M>) => number;
    selectById: (
      state: EnhancedEntityState<T, M>,
      id: EntityId
    ) => T | undefined;
    selectMetadata: (state: EnhancedEntityState<T, M>) => M | undefined;
  };
}

export function createEnhancedAdapter<T, M = never>({
  sortComparer,
  IdProp = (entity: T): string => {
    if (!(entity as any).id) {
      throw new Error("Entity ID is required");
    }
    return "id";
  },
}: {
  sortComparer?: (a: T, b: T) => number;
  IdProp?: (entity: T) => string;
} = {}): EnhancedEntityAdapter<T, M> & {
  getInitialState: (metadata?: M) => EnhancedEntityState<T, M>;
} {
  function selectId(entity: T): string {
    return (entity as any)[IdProp(entity)];
  }

  function getInitialState(metadata?: M): EnhancedEntityState<T, M> {
    return {
      ids: [],
      entities: {} as Dictionary<T>,
      metadata,
    };
  }

  function insertAt(
    state: EnhancedEntityState<T, M>,
    index: number,
    entity: T
  ): EnhancedEntityState<T, M> {
    const id = selectId(entity);
    const newIds = [...state.ids];
    newIds.splice(index, 0, id);
    state.ids = newIds;
    state.entities[id] = entity;
    if (sortComparer) {
      state.ids = state.ids.sort((a, b) =>
        sortComparer(state.entities[a], state.entities[b])
      );
    }
    return state;
  }

  function swap(
    state: EnhancedEntityState<T, M>,
    indexA: number,
    indexB: number
  ): EnhancedEntityState<T, M> {
    const newIds = [...state.ids];
    [newIds[indexA], newIds[indexB]] = [newIds[indexB], newIds[indexA]];
    state.ids = newIds;
    if (sortComparer) {
      state.ids = state.ids.sort((a, b) =>
        sortComparer(state.entities[a], state.entities[b])
      );
    }
    return state;
  }

  function swapWhere(
    state: EnhancedEntityState<T, M>,
    predicate: (entity: T) => boolean,
    withPredicate: (entity: T) => boolean
  ): EnhancedEntityState<T, M> {
    const entityA = Object.values(state.entities as Dictionary<T>).find(
      (entity): entity is T => entity !== undefined && predicate(entity)
    );
    const entityB = Object.values(state.entities as Dictionary<T>).find(
      (entity): entity is T => entity !== undefined && withPredicate(entity)
    );

    if (!entityA || !entityB) return state;

    const indexA = state.ids.indexOf(selectId(entityA));
    const indexB = state.ids.indexOf(selectId(entityB));

    const newState = swap(state, indexA, indexB);
    if (sortComparer) {
      newState.ids = newState.ids.sort((a, b) =>
        sortComparer(newState.entities[a], newState.entities[b])
      );
    }
    return newState;
  }

  function move(
    state: EnhancedEntityState<T, M>,
    fromIndex: number,
    toIndex: number
  ): EnhancedEntityState<T, M> {
    const newIds = [...state.ids];
    const [movedId] = newIds.splice(fromIndex, 1);
    newIds.splice(toIndex, 0, movedId);
    state.ids = newIds;
    if (sortComparer) {
      state.ids = state.ids.sort((a, b) =>
        sortComparer(state.entities[a], state.entities[b])
      );
    }
    return state;
  }

  function updateMetadata(
    state: EnhancedEntityState<T, M>,
    metadata: Partial<M>
  ): EnhancedEntityState<T, M> {
    state.metadata = {
      ...state.metadata,
      ...metadata,
    } as M;
    return state;
  }

  function duplicate(
    state: EnhancedEntityState<T, M>,
    sourceId: EntityId,
    newId: EntityId
  ): EnhancedEntityState<T, M> {
    const sourceEntity = state.entities[sourceId];
    if (!sourceEntity) return state;

    // todo: deep copy
    const newEntity = JSON.parse(JSON.stringify(sourceEntity));
    // use selectId to set new id
    newEntity[IdProp(newEntity)] = newId;
    console.log("newEntity", newEntity);

    return addOne(state, newEntity);
  }

  function addOne(
    state: EnhancedEntityState<T, M>,
    entity: T,
    sort: boolean = true
  ): EnhancedEntityState<T, M> {
    const id = selectId(entity);
    state.ids.push(id);
    state.entities[id] = entity;
    if (sortComparer && sort) {
      state.ids = state.ids.sort((a, b) =>
        sortComparer(state.entities[a], state.entities[b])
      );
    }
    return state;
  }

  function addMany(
    state: EnhancedEntityState<T, M>,
    entities: T[]
  ): EnhancedEntityState<T, M> {
    entities.forEach((entity) => addOne(state, entity, false));
    if (sortComparer) {
      state.ids = state.ids.sort((a, b) =>
        sortComparer(state.entities[a], state.entities[b])
      );
    }
    return state;
  }

  function setOne(
    state: EnhancedEntityState<T, M>,
    entity: T,
    sort: boolean = true
  ): EnhancedEntityState<T, M> {
    const id = selectId(entity);
    state.entities[id] = entity;
    if (!state.ids.includes(id)) {
      state.ids.push(id);
    }
    if (sortComparer && sort) {
      state.ids = state.ids.sort((a, b) =>
        sortComparer(state.entities[a], state.entities[b])
      );
    }
    return state;
  }

  function setMany(
    state: EnhancedEntityState<T, M>,
    entities: T[]
  ): EnhancedEntityState<T, M> {
    entities.forEach((entity) => setOne(state, entity, false));
    if (sortComparer) {
      state.ids = state.ids.sort((a, b) =>
        sortComparer(state.entities[a], state.entities[b])
      );
    }
    return state;
  }

  function setAll(
    state: EnhancedEntityState<T, M>,
    entities: T[]
  ): EnhancedEntityState<T, M> {
    state.ids = entities.map(selectId);
    state.entities = entities.reduce((acc, entity) => {
      acc[selectId(entity)] = entity;
      return acc;
    }, {} as Dictionary<T>);
    if (sortComparer) {
      state.ids = state.ids.sort((a, b) =>
        sortComparer(state.entities[a], state.entities[b])
      );
    }
    return state;
  }

  function removeOne(
    state: EnhancedEntityState<T, M>,
    id: EntityId
  ): EnhancedEntityState<T, M> {
    const { [id]: removed, ...entities } = state.entities;
    state.ids = state.ids.filter((eid) => eid !== id);
    state.entities = entities;
    return state;
  }

  function removeMany(
    state: EnhancedEntityState<T, M>,
    ids: EntityId[]
  ): EnhancedEntityState<T, M> {
    ids.forEach((id) => removeOne(state, id));
    return state;
  }

  function removeAll(
    state: EnhancedEntityState<T, M>
  ): EnhancedEntityState<T, M> {
    state.ids = [];
    state.entities = {} as Dictionary<T>;
    return state;
  }

  function updateOne(
    state: EnhancedEntityState<T, M>,
    update: { id: EntityId; changes: Partial<T> }
  ): EnhancedEntityState<T, M> {
    const entity = state.entities[update.id];
    if (!entity) return state;
    state.entities[update.id] = { ...entity, ...update.changes };
    return state;
  }

  function updateMany(
    state: EnhancedEntityState<T, M>,
    updates: Array<{ id: EntityId; changes: Partial<T> }>
  ): EnhancedEntityState<T, M> {
    updates.forEach((update) => updateOne(state, update));
    return state;
  }

  return {
    getInitialState,
    insertAt,
    insertManyAt: (state, index, entities) =>
      entities.reduce((s, entity, i) => insertAt(s, index + i, entity), state),
    swap,
    swapWhere,
    move,
    updateMetadata,
    duplicate,
    // Standard adapter methods
    addOne,
    addMany,
    setOne,
    setMany,
    setAll,
    removeOne,
    removeMany,
    removeAll,
    updateOne,
    updateMany,
    getSelectors: () => ({
      selectIds: (state) => state.ids,
      selectEntities: (state) => state.entities,
      selectAll: (state) => state.ids.map((id) => state.entities[id]!),
      selectTotal: (state) => state.ids.length,
      selectById: (state, id) => state.entities[id],
      selectMetadata: (state) => state.metadata,
    }),
  };
}
