import { useMemo } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { useScrollEventsHandlersDefault } from '@gorhom/bottom-sheet';

export default function useFeedScrollEventsHandlers(ref, offset) {
  const handlers = useScrollEventsHandlersDefault(ref, offset);
  const handlingScroll = useSharedValue(false);
  const { handleOnScroll, handleOnBeginDrag, handleOnEndDrag, handleOnMomentumEnd } = handlers;

  return useMemo(() => {
    // Fabric can synchronously emit onScroll inside the library's scrollTo command.
    // Keep its lock behavior, but bound re-entry: gorhom/react-native-bottom-sheet#2730.
    const guard = (handler) => (event, context) => {
      'worklet';
      if (handlingScroll.value) return;
      handlingScroll.value = true;
      try {
        handler(event, context);
      } finally {
        handlingScroll.value = false;
      }
    };

    return {
      handleOnScroll: guard(handleOnScroll),
      handleOnBeginDrag,
      handleOnEndDrag: guard(handleOnEndDrag),
      handleOnMomentumEnd: guard(handleOnMomentumEnd),
    };
  }, [handleOnScroll, handleOnBeginDrag, handleOnEndDrag, handleOnMomentumEnd, handlingScroll]);
}
