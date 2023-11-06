import {FRAME_WIDTH} from '../components/FrameTimeLine';
import {ILeftPlayTimes, IRightPlayTimes} from '../types/model';

export const getLeftPlayTime = ({
  scrollOffset,
  secPerFrame,
  leftDifference,
}: ILeftPlayTimes) => {
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
}: IRightPlayTimes) => {
  if (scrollOffset >= 0) {
    return (
      secPerFrame *
      ((scrollOffset + trimWindowWidth + leftDifference) / FRAME_WIDTH)
    );
  }
  return (secPerFrame * (trimWindowWidth + leftDifference)) / FRAME_WIDTH;
};
