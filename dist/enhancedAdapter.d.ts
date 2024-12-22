type EntityId = string;
type Dictionary<T> = Record<EntityId, T>;
export interface EnhancedEntityState<T, M = never> {
    ids: EntityId[];
    entities: Dictionary<T>;
    metadata?: M;
}
export interface EnhancedEntityAdapter<T, M = never> {
    addOne: (state: EnhancedEntityState<T, M>, entity: T) => EnhancedEntityState<T, M>;
    addMany: (state: EnhancedEntityState<T, M>, entities: T[]) => EnhancedEntityState<T, M>;
    setOne: (state: EnhancedEntityState<T, M>, entity: T) => EnhancedEntityState<T, M>;
    setMany: (state: EnhancedEntityState<T, M>, entities: T[]) => EnhancedEntityState<T, M>;
    setAll: (state: EnhancedEntityState<T, M>, entities: T[]) => EnhancedEntityState<T, M>;
    removeOne: (state: EnhancedEntityState<T, M>, key: EntityId) => EnhancedEntityState<T, M>;
    removeMany: (state: EnhancedEntityState<T, M>, keys: EntityId[]) => EnhancedEntityState<T, M>;
    removeAll: (state: EnhancedEntityState<T, M>) => EnhancedEntityState<T, M>;
    updateOne: (state: EnhancedEntityState<T, M>, update: {
        id: EntityId;
        changes: Partial<T>;
    }) => EnhancedEntityState<T, M>;
    updateMany: (state: EnhancedEntityState<T, M>, updates: Array<{
        id: EntityId;
        changes: Partial<T>;
    }>) => EnhancedEntityState<T, M>;
    insertAt: (state: EnhancedEntityState<T, M>, index: number, entity: T) => EnhancedEntityState<T, M>;
    insertManyAt: (state: EnhancedEntityState<T, M>, index: number, entities: T[]) => EnhancedEntityState<T, M>;
    swap: (state: EnhancedEntityState<T, M>, indexA: number, indexB: number) => EnhancedEntityState<T, M>;
    swapWhere: (state: EnhancedEntityState<T, M>, predicate: (entity: T) => boolean, withPredicate: (entity: T) => boolean) => EnhancedEntityState<T, M>;
    move: (state: EnhancedEntityState<T, M>, fromIndex: number, toIndex: number) => EnhancedEntityState<T, M>;
    updateMetadata: (state: EnhancedEntityState<T, M>, metadata: Partial<M>) => EnhancedEntityState<T, M>;
    duplicate: (state: EnhancedEntityState<T, M>, sourceId: EntityId, newId: EntityId) => EnhancedEntityState<T, M>;
    getSelectors: () => {
        selectIds: (state: EnhancedEntityState<T, M>) => EntityId[];
        selectEntities: (state: EnhancedEntityState<T, M>) => Dictionary<T>;
        selectAll: (state: EnhancedEntityState<T, M>) => T[];
        selectTotal: (state: EnhancedEntityState<T, M>) => number;
        selectById: (state: EnhancedEntityState<T, M>, id: EntityId) => T | undefined;
        selectMetadata: (state: EnhancedEntityState<T, M>) => M | undefined;
    };
}
export declare function createEnhancedAdapter<T, M = never>({ sortComparer, IdProp, }?: {
    sortComparer?: (a: T, b: T) => number;
    IdProp?: (entity: T) => string;
}): EnhancedEntityAdapter<T, M> & {
    getInitialState: (metadata?: M) => EnhancedEntityState<T, M>;
};
export {};
