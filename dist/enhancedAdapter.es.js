function D({
  sortComparer: u,
  IdProp: h = (f) => {
    if (!f.id)
      throw new Error("Entity ID is required");
    return "id";
  }
} = {}) {
  function f(i) {
    return i[h(i)];
  }
  function y(i) {
    return {
      ids: [],
      entities: {},
      metadata: i
    };
  }
  function E(i, n, e) {
    const d = f(e), c = [...i.ids];
    return c.splice(n, 0, d), i.ids = c, i.entities[d] = e, u && (i.ids = i.ids.sort(
      (s, o) => u(i.entities[s], i.entities[o])
    )), i;
  }
  function v(i, n, e) {
    const d = [...i.ids];
    return [d[n], d[e]] = [d[e], d[n]], i.ids = d, u && (i.ids = i.ids.sort(
      (c, s) => u(i.entities[c], i.entities[s])
    )), i;
  }
  function A(i, n, e) {
    const d = Object.values(i.entities).find(
      (r) => r !== void 0 && n(r)
    ), c = Object.values(i.entities).find(
      (r) => r !== void 0 && e(r)
    );
    if (!d || !c) return i;
    const s = i.ids.indexOf(f(d)), o = i.ids.indexOf(f(c)), l = v(i, s, o);
    return u && (l.ids = l.ids.sort(
      (r, q) => u(l.entities[r], l.entities[q])
    )), l;
  }
  function M(i, n, e) {
    const d = [...i.ids], [c] = d.splice(n, 1);
    return d.splice(e, 0, c), i.ids = d, u && (i.ids = i.ids.sort(
      (s, o) => u(i.entities[s], i.entities[o])
    )), i;
  }
  function g(i, n) {
    return i.metadata = {
      ...i.metadata,
      ...n
    }, i;
  }
  function S(i, n, e) {
    const d = i.entities[n];
    if (!d) return i;
    const c = JSON.parse(JSON.stringify(d));
    return c[h(c)] = e, console.log("newEntity", c), t(i, c);
  }
  function t(i, n, e = !0) {
    const d = f(n);
    return i.ids.push(d), i.entities[d] = n, u && e && (i.ids = i.ids.sort(
      (c, s) => u(i.entities[c], i.entities[s])
    )), i;
  }
  function x(i, n) {
    return n.forEach((e) => t(i, e, !1)), u && (i.ids = i.ids.sort(
      (e, d) => u(i.entities[e], i.entities[d])
    )), i;
  }
  function w(i, n, e = !0) {
    const d = f(n);
    return i.entities[d] = n, i.ids.includes(d) || i.ids.push(d), u && e && (i.ids = i.ids.sort(
      (c, s) => u(i.entities[c], i.entities[s])
    )), i;
  }
  function b(i, n) {
    return n.forEach((e) => w(i, e, !1)), u && (i.ids = i.ids.sort(
      (e, d) => u(i.entities[e], i.entities[d])
    )), i;
  }
  function j(i, n) {
    return i.ids = n.map(f), i.entities = n.reduce((e, d) => (e[f(d)] = d, e), {}), u && (i.ids = i.ids.sort(
      (e, d) => u(i.entities[e], i.entities[d])
    )), i;
  }
  function O(i, n) {
    const { [n]: e, ...d } = i.entities;
    return i.ids = i.ids.filter((c) => c !== n), i.entities = d, i;
  }
  function B(i, n) {
    return n.forEach((e) => O(i, e)), i;
  }
  function J(i) {
    return i.ids = [], i.entities = {}, i;
  }
  function I(i, n) {
    const e = i.entities[n.id];
    return e && (i.entities[n.id] = { ...e, ...n.changes }), i;
  }
  function N(i, n) {
    return n.forEach((e) => I(i, e)), i;
  }
  return {
    getInitialState: y,
    insertAt: E,
    insertManyAt: (i, n, e) => e.reduce((d, c, s) => E(d, n + s, c), i),
    swap: v,
    swapWhere: A,
    move: M,
    updateMetadata: g,
    duplicate: S,
    // Standard adapter methods
    addOne: t,
    addMany: x,
    setOne: w,
    setMany: b,
    setAll: j,
    removeOne: O,
    removeMany: B,
    removeAll: J,
    updateOne: I,
    updateMany: N,
    getSelectors: () => ({
      selectIds: (i) => i.ids,
      selectEntities: (i) => i.entities,
      selectAll: (i) => i.ids.map((n) => i.entities[n]),
      selectTotal: (i) => i.ids.length,
      selectById: (i, n) => i.entities[n],
      selectMetadata: (i) => i.metadata
    })
  };
}
export {
  D as createEnhancedAdapter
};
