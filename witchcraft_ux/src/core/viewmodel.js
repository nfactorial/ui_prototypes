// A minimal field-notify viewmodel — the shape of a UMG MVVM viewmodel.
// Screens subscribe to individual fields; setting a field notifies only its
// subscribers, and only when the value actually changed.

export function createViewModel(name, initial = {}) {
  const fields = { ...initial };
  const subs = new Map(); // field -> Set<fn>

  const vm = {
    name,

    get(field) {
      return fields[field];
    },

    set(field, value) {
      if (Object.is(fields[field], value)) return;
      fields[field] = value;
      subs.get(field)?.forEach((fn) => fn(value));
    },

    patch(values) {
      for (const [k, v] of Object.entries(values)) vm.set(k, v);
    },

    // Subscribe to one field. Fires immediately with the current value unless
    // { immediate: false }. Returns an unsubscribe function.
    on(field, fn, { immediate = true } = {}) {
      if (!subs.has(field)) subs.set(field, new Set());
      subs.get(field).add(fn);
      if (immediate) fn(fields[field]);
      return () => subs.get(field)?.delete(fn);
    },

    snapshot() {
      return { ...fields };
    },
  };
  return vm;
}
