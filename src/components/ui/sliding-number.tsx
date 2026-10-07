'use client';

// From Motion Primitives by ibelick (MIT), also listed free on 21st.dev: https://motion-primitives.com/docs/sliding-number
import { useEffect } from 'react';
import {
  MotionValue,
  motion,
  useSpring,
  useTransform,
  motionValue,
} from 'motion/react';

const TRANSITION = {
  type: 'spring' as const,
  stiffness: 280,
  damping: 18,
  mass: 0.3,
};

function Digit({ value, place }: { value: number; place: number }) {
  const valueRoundedToPlace = Math.floor(value / place) % 10;
  const initial = motionValue(valueRoundedToPlace);
  const animatedValue = useSpring(initial, TRANSITION);

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);

  return (
    // local change: spans instead of divs so it can sit inside text elements like <p>
    <span className='relative inline-block w-[1ch] overflow-x-visible overflow-y-clip leading-none tabular-nums'>
      <span className='invisible block'>0</span>
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} />
      ))}
    </span>
  );
}

// local change: each digit is exactly 1em tall (leading-none), so offsets are in em instead of measured
// pixels. The original hid every digit until a ResizeObserver reported a height, which left the clock
// blank whenever that measurement was slow, and rendered nothing useful on the server.
function Number({ mv, number }: { mv: MotionValue<number>; number: number }) {
  const y = useTransform(mv, (latest) => {
    const placeValue = latest % 10;
    let offset = (10 + number - placeValue) % 10;
    if (offset > 5) offset -= 10;
    return `${offset}em`;
  });

  return (
    <motion.span style={{ y }} className='absolute inset-0 flex items-center justify-center'>
      {number}
    </motion.span>
  );
}

type SlidingNumberProps = {
  value: number;
  padStart?: boolean;
  decimalSeparator?: string;
};

export function SlidingNumber({
  value,
  padStart = false,
  decimalSeparator = '.',
}: SlidingNumberProps) {
  const absValue = Math.abs(value);
  const [integerPart, decimalPart] = absValue.toString().split('.');
  const integerValue = parseInt(integerPart, 10);
  const paddedInteger =
    padStart && integerValue < 10 ? `0${integerPart}` : integerPart;
  const integerDigits = paddedInteger.split('');
  const integerPlaces = integerDigits.map((_, i) =>
    Math.pow(10, integerDigits.length - i - 1)
  );

  return (
    <span className='inline-flex items-center'>
      {value < 0 && '-'}
      {integerDigits.map((_, index) => (
        <Digit
          key={`pos-${integerPlaces[index]}`}
          value={integerValue}
          place={integerPlaces[index]}
        />
      ))}
      {decimalPart && (
        <>
          <span>{decimalSeparator}</span>
          {decimalPart.split('').map((_, index) => (
            <Digit
              key={`decimal-${index}`}
              value={parseInt(decimalPart, 10)}
              place={Math.pow(10, decimalPart.length - index - 1)}
            />
          ))}
        </>
      )}
    </span>
  );
}
