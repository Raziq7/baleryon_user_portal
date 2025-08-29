'use client';

import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store/store';
import { increment, decrement, incrementByAmount } from '@/store/slices/counterSlice';
import { Button } from "@/components/ui/button";

export default function Counter() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-2xl font-bold">Counter: {count}</h2>
      <div className="flex gap-2">
        <Button
          onClick={() => dispatch(decrement())}
          variant="outline"
        >
          Decrease
        </Button>
        <Button
          onClick={() => dispatch(increment())}
          variant="default"
        >
          Increase
        </Button>
        <Button
          onClick={() => dispatch(incrementByAmount(5))}
          variant="secondary"
        >
          Add 5
        </Button>
      </div>
    </div>
  );
}
