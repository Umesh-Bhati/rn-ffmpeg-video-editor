import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  PanResponder,
} from 'react-native';
import { createRef, useCallback, useRef, useState } from 'react';
import {
  getLeftPlayTime,
  getRightPlayTime,
} from '../utility/calculatePlayTimes';
import FFmpegWrapper from '../lib/FFmpegWrapper';
import RNFS from 'react-native-fs';
import type {
  ITrimVideo,
  IUseFrameController,
  IVideoMetaData,
} from '../types/model';
import { NUM_OF_FRAMES } from '../components/FrameTimeLine';

const useTrimController = ({
  seekAt,
  durationWindowWidth,
  inputVidMetaData,
}: IUseFrameController) => {
  const LEFT = useRef(0);
  const [positions, setPositions] = useState({
    right: LEFT.current,
    left: LEFT.current,
  });
  const [trimWindowWidth, setTrimWindowWidth] = useState(durationWindowWidth);
  const [videoMetaData, setVideoMetaData] = useState<IVideoMetaData>({
    frames: [],
    trimmedVidUrl: '',
    duration: 0,
  });
  const scrollOffSet = createRef();
  const timersParams = useRef({
    scrollOffset: 0,
    leftDifference: 0,
    trimWindowWidth,
    secPerFrame: 2,
  });

  const panResponderLeft = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderRelease: () => {
      const playbackTime = getLeftPlayTime(timersParams.current);
      seekAt?.(playbackTime);
    },
    onPanResponderMove: (_, gestureState) => {
      const leftPosition = positions.left + gestureState.dx;
      const newWidth = trimWindowWidth - gestureState.dx;
      if (newWidth >= 0 && leftPosition >= LEFT.current) {
        setPositions((old) => ({ ...old, left: leftPosition }));
        setTrimWindowWidth(newWidth);
        timersParams.current = {
          ...timersParams.current,
          leftDifference: leftPosition - LEFT.current,
          trimWindowWidth: newWidth,
        };
      }
    },
  });

  const panResponderRight = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const newWidth = trimWindowWidth + gestureState.dx;
      const rightPosition = positions.right + gestureState.dx;
      if (newWidth >= 0 && rightPosition <= LEFT.current) {
        setTrimWindowWidth(newWidth);
        setPositions((old) => ({ ...old, right: rightPosition }));
      }
    },
  });

  const handleOnVidEnd = () => {
    const leftTime = getLeftPlayTime(timersParams?.current);
    seekAt?.(leftTime);
  };

  const handleOnScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    timersParams.current = {
      ...timersParams.current,
      scrollOffset: Number(nativeEvent.contentOffset.x),
    };
    const playbackTime = getLeftPlayTime(timersParams.current);
    seekAt?.(playbackTime);
  };

  const getFrames = useCallback(async () => {
    try {
      const vidDuration =
        typeof inputVidMetaData.duration === 'number'
          ? inputVidMetaData.duration / 1000
          : 5;
      let numOfFrames = NUM_OF_FRAMES;
      vidDuration > 60 &&
        (numOfFrames = Math.round((vidDuration / 60) * numOfFrames));
      let secPerFrame = vidDuration / numOfFrames;
      timersParams.current.secPerFrame = secPerFrame;
      setVideoMetaData((old) => ({
        ...old,
        frames: Array(+numOfFrames).fill(null),
      }));
      const framesPath = await FFmpegWrapper.generateFrames({
        ...inputVidMetaData,
        secPerFrame,
      });
      const _frames: string[] = [];
      for (let i = 0; i < numOfFrames; i++) {
        _frames.push(
          `${framesPath?.replace('%3d', String(i + 1).padStart(3, '0'))}`
        );
      }
      setVideoMetaData((old) => ({ ...old, frames: _frames }));
    } catch (error) {
      console.error('errorWhlieGettingFrams ', error);
    }
  }, [inputVidMetaData]);

  const clearCache = (): Promise<string> =>
    new Promise(async (resolve, reject) => {
      try {
        if (videoMetaData.frames.length > 0) {
          for (let frameFilePath of videoMetaData.frames) {
            const isExist =
              !!frameFilePath && (await RNFS.exists(frameFilePath));
            if (isExist) {
              await RNFS.unlink(frameFilePath);
            }
          }
          const isTrimVidExist =
            !!videoMetaData.trimmedVidUrl &&
            (await RNFS.exists(videoMetaData.trimmedVidUrl));
          isTrimVidExist && (await RNFS.unlink(videoMetaData.trimmedVidUrl));
          resolve('cached files of triming is removed succfully!');
        }
      } catch (error) {
        reject('error occurred during clearing cache of triming');
      }
    });

  const trimVideo = async ({
    clearCacheFiles,
  }: ITrimVideo): Promise<string> => {
    try {
      const startTimeInSeconds = getLeftPlayTime(timersParams.current);
      const endTimeInSeconds = getRightPlayTime(timersParams.current);
      const params = {
        path: inputVidMetaData?.path,
        startTimeInSeconds,
        endTimeInSeconds,
      };
      const trimmedVidUrl: string = await FFmpegWrapper.generatetrimVideo(
        params
      );
      setVideoMetaData((old) => ({ ...old, trimmedVidUrl }));
      clearCacheFiles && (await clearCache());
      return trimmedVidUrl;
    } catch (error) {
      console.error('error ', error);
      throw error;
    }
  };

  return {
    ...positions,
    trimWindowWidth,
    scrollOffSet,
    videoMetaData,
    panResponderLeft,
    panResponderRight,
    getFrames,
    handleOnScroll,
    handleOnVidEnd,
    trimVideo,
    LEFT,
    setPositions,
    clearCache,
  };
};

export default useTrimController;
