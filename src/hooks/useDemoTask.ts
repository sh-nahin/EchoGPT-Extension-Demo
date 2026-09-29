import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { requestDemo } from '../services/ai';

export function useDemoTask() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const { notify } = useApp();
  useEffect(() => () => abort.current?.abort(), []);
  const run = async (prompt: string, model: string, task?: string) => {
    abort.current?.abort();
    abort.current = new AbortController();
    setLoading(true);
    try {
      setResult(await requestDemo({ prompt, model, task }, abort.current.signal));
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError'))
        notify('The preview could not load. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return { result, loading, run };
}
