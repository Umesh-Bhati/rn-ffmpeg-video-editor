import { FRAME_WIDTH } from '../components/FrameTimeLine';
import type { IPlayTimes } from '../types/model';

export const getLeftPlayTime = ({
  scrollOffset,
  secPerFrame,
  leftDifference,
}: Omit<IPlayTimes, 'trimWindowWidth'>) => {
  if (scrollOffset >= 0) {
    return secPerFrame * ((scrollOffset + leftDifference) / FRAME_WIDTH);
  }
  return (secPerFrame * leftDifference) / FRAME_WIDTH;
};

export const getRightPlayTime = ({
  scrollOffset,
  secPerFrame,
  leftDifference,
  trimWindowWidth,
}: IPlayTimes) => {
  if (scrollOffset >= 0) {
    return (
      secPerFrame *
      ((scrollOffset + trimWindowWidth + leftDifference) / FRAME_WIDTH)
    );
  }
  return (secPerFrame * (trimWindowWidth + leftDifference)) / FRAME_WIDTH;
};
