import { useState } from 'react';

const useRerender = () => {
  const [, setRerender] = useState({});

  return () => setRerender({});
};

export { useRerender };
