import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

export interface IFrameTimeLineRef {
  videoMetaData: IVideoMetaData;
  trimVideo?: (_options: ITrimVideo) => Promise<string | undefined>;
  clearCache?: () => Promise<string>;
}

export interface IFrameTimeLine {
  durationWindowWidth: number;
  inputVidMetaData: IInputVideo;
  leftBarStyle?: ViewStyle;
  rightBarStyle?: ViewStyle;
  rightBarChildren?: ReactNode;
  leftBarChildren?: ReactNode;
  seekAt?: (arg0: number) => void;
}

export type IUseFrameController = Omit<
  IFrameTimeLine,
  'leftBarStyle' | 'rightBarStyle' | 'rightBarChildren' | 'leftBarChildren'
>;

export interface IPlayTimes {
  scrollOffset: number;
  secPerFrame: number;
  leftDifference: number;
  trimWindowWidth: number;
}
export interface IVideoMetaData {
  frames: string[];
  trimmedVidUrl: string;
  duration: number;
}

export interface ITrimVideo {
  clearCacheFiles?: boolean;
}

export interface IInputVideo {
  path: string;
  duration: number | null;
  filename: string;
}
