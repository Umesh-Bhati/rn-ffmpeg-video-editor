import {
  Dimensions,
  StyleSheet,
  View,
  Animated,
  ViewStyle,
  Image,
  LayoutChangeEvent,
  ActivityIndicator,
} from 'react-native';
import React, {
  FC,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {useTrimController} from '../hooks';
import type { IFrameControllers, ITrimVideo, IVideoMetaData } from '../types/model';


export const {width: SCREEN_WIDTH} = Dimensions.get('screen');
export const BAR_WIDTH = 20;
export const DURATION_WINDOW_WIDTH = SCREEN_WIDTH * 0.75;
export const FRAME_WIDTH = DURATION_WINDOW_WIDTH / 5;

interface IRef {
  videoMetaData: IVideoMetaData;
  trimVideo: (_options: ITrimVideo) => Promise<string | undefined>;
  clearCache: () => Promise<string>;
}

const FrameTimeLine: FC<IFrameControllers> = forwardRef((props, ref) => {
  const {
    left,
    trimWindowWidth,
    panResponderLeft,
    panResponderRight,
    handleOnScroll,
    getFrames,
    trimVideo,
    videoMetaData,
    setPositions,
    LEFT,
    clearCache,
  } = useTrimController(props);
  const [barsWidth, setBarsWidth] = useState({
    leftBarWidth: BAR_WIDTH,
    rightBarWidth: BAR_WIDTH,
  });

  useImperativeHandle(
    ref,
    (): IRef => ({
      trimVideo,
      videoMetaData,
      clearCache,
    }),
  );

  useEffect(() => {
    if (props.inputVidMetaData.path) {
      getFrames();
    }
  }, [getFrames, props.inputVidMetaData.path]);

  // styles

  const controlLeftBarStyle = StyleSheet.flatten([
    styles.controlBar,
    {borderTopLeftRadius: 5, borderBottomLeftRadius: 5},
    props.leftBarStyle,
    {
      left,
    },
  ]) as ViewStyle;
  const controlRightBarStyle = StyleSheet.flatten([
    styles.controlBar,
    {borderTopRightRadius: 5, borderBottomRightRadius: 5},
    props.rightBarStyle,
    {
      left,
    },
  ]) as ViewStyle;

  const trimWindowStyle = StyleSheet.flatten([
    styles.trimWindow,
    {
      width: trimWindowWidth,
      left,
    },
  ]) as ViewStyle;

  const framContainer = (showBorder = false) =>
    StyleSheet.flatten([
      {
        height: '100%',
        width: FRAME_WIDTH,
        backgroundColor: 'lightgray',
        borderRightWidth: showBorder ? 1 : 0,
        borderColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
      },
    ]) as ViewStyle;

  // functions

  const renderFrames = (frame: string | null, index: number) => {
    const lastIndexOf = videoMetaData?.frames?.length - 1;
    return (
      <View key={index.toString()} style={framContainer(index !== lastIndexOf)}>
        {frame ? (
          <Image
            key={index.toString()}
            source={{uri: 'file://' + frame}}
            style={styles.frameImage}
          />
        ) : (
          <ActivityIndicator size={'small'} color="grey" />
        )}
      </View>
    );
  };

  const barsOnLaylout = (event: LayoutChangeEvent, isRight = false) => {
    const {width} = event.nativeEvent.layout;
    const barWidth = barsWidth[isRight ? 'rightBarWidth' : 'leftBarWidth'];

    if (barWidth !== width || LEFT.current === 0) {
      const rightWidth = isRight ? width : barsWidth.rightBarWidth;
      const leftWidth = isRight ? barsWidth.leftBarWidth : width;
      setBarsWidth({leftBarWidth: leftWidth, rightBarWidth: rightWidth});
      LEFT.current =
        (SCREEN_WIDTH - props.durationWindowWidth - rightWidth - leftWidth) / 2;
      setPositions({left: LEFT.current, right: LEFT.current});
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        {...panResponderLeft.panHandlers}
        onLayout={event => barsOnLaylout(event, false)}
        style={controlLeftBarStyle}
      >
        {props.rightBarChildren}
      </Animated.View>
      <Animated.View style={trimWindowStyle} />
      <Animated.View
        {...panResponderRight.panHandlers}
        onLayout={event => barsOnLaylout(event, true)}
        style={controlRightBarStyle}
      >
        {props.leftBarChildren}
      </Animated.View>
      <Animated.ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        style={[styles.scroll]}
        contentContainerStyle={{
          paddingRight: LEFT.current + barsWidth.rightBarWidth,
          paddingLeft: LEFT.current + barsWidth.leftBarWidth,
        }}
        alwaysBounceHorizontal={false}
        scrollEventThrottle={1}
        onScroll={handleOnScroll}
      >
        {videoMetaData.frames.map(renderFrames)}
      </Animated.ScrollView>
    </View>
  );
});

FrameTimeLine.defaultProps = {
  durationWindowWidth: DURATION_WINDOW_WIDTH,
  numberOfFrames: 5,
};

export default FrameTimeLine;

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: 45,
    flexDirection: 'row',
  },
  scroll: {
    width: SCREEN_WIDTH,
    position: 'absolute',
    height: '90%',
    alignSelf: 'center',
  },
  controlBar: {
    height: '100%',
    width: 20,
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow',
  },
  trimWindow: {
    height: '100%',
    borderTopWidth: 3,
    borderBottomWidth: 3,
    borderColor: 'yellow',
  },
  frameImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
});
