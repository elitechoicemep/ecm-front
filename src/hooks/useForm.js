import { useState } from 'react';

/**
 * Reusable form state hook.
 *
 * Returns:
 *   values      – current field values
 *   set(key)    – onChange handler factory: <input onChange={set('name')} />
 *   setVal(k,v) – programmatic setter for non-input values (e.g. file data)
 *   merge(obj)  – shallow-merge a partial update into values
 *   reset()     – restore to initial values
 *   setValues   – raw setter for full replacement
 */
export function useForm(initial) {
  const [values, setValues] = useState(initial);

  const set = key => e => setValues(v => ({ ...v, [key]: e.target.value }));

  const setVal = (key, val) => setValues(v => ({ ...v, [key]: val }));

  const merge = updates => setValues(v => ({ ...v, ...updates }));

  const reset = () => setValues(initial);

  return { values, set, setVal, merge, reset, setValues };
}
