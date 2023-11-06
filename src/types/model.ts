import {MutableRefObject, ViewStyle, ReactNode } from 'react';
export interface IFrameControllers {
  videoPlayerRef: MutableRefObject<undefined>;
  numberOfFrames: number;
  durationWindowWidth: number;
  maxTrimTime: number;
  frameWidth: number;
  inputVidMetaData: IVideo;
  leftBarStyle?: ViewStyle;
  rightBarStyle?: ViewStyle;
  rightBarChildren?: ReactNode;
  leftBarChildren?: ReactNode;
}

export interface ILeftPlayTimes {
  scrollOffset: number;
  secPerFrame: number;
  leftDifference: number;
  frameWidth: number;
}
export interface IRightPlayTimes extends ILeftPlayTimes {
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

export interface IVideo {
  path: string;
  duration: number | null;
  filename: string;
}
