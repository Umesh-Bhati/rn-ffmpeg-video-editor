# rn-ffmpeg-video-editor

rn-ffmpeg-video-editor: An easy-to-use React Native library that allows you to effortlessly trim and manipulate video content. With a user-friendly timeline component, you can quickly select and trim specific portions of a video, giving you the power to create customized video segments. Built on the foundation of ffmpeg-kit-react-native, this library bridges the gap between native FFmpeg functionality and JavaScript, making video editing a breeze in your React Native applications. Stay tuned for more exciting features, including video filters, in future updates!

## Installation

```sh
npm install rn-ffmpeg-video-editor
```
or

```sh
yarn add rn-ffmpeg-video-editor
```

This package uses [react-native-fs](https://www.npmjs.com/package/react-native-fs) package as a peer dependency so you have to install this package also in your project.

## Usage

```js
import React, {useState, createRef} from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import {FrameTimeLine} from 'rn-ffmpeg-video-editor';
import ImageCropPicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';

const App = () => {
  const [selectedVid, setSelectedVid] = useState('');
  const frameRef = createRef();
  const videoRef = createRef();

  const handleSelectVid = async () => {
    try {
      const resPath = await ImageCropPicker.openPicker({mediaType: 'video'});
      setSelectedVid(resPath);
    } catch (error) {
      console.error('selectVidErr ', error);
    }
  };

  const cropVideo = async () => {
    await frameRef.current.trimVideo({clearCacheFiles: true});
    console.log('videoUrl ', frameRef?.current.videoMetaData);
  };

  return (
    <View style={styles.container}>
      <FrameTimeLine
        ref={frameRef}
        seekAt={time => {
          videoRef.current?.seek(time);
        }}
        inputVidMetaData={selectedVid}
      />

      <Video
        ref={videoRef}
        source={{
          uri: 'file://' + selectedVid.path,
        }}
        style={styles.video}
        resizeMode="contain"
        muted
        repeat
        paused={false}
      />
      <View style={styles.btnContainer}>
        <TouchableOpacity
          onPress={handleSelectVid}
          style={styles.selectVidButton}
        >
          <Text style={styles.btnTxt}>Select Video</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={cropVideo} style={styles.selectVidButton}>
          <Text style={styles.btnTxt}>Crop Video</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: 300,
    marginTop: 15,
  },
  selectVidButton: {
    padding: 10,
    backgroundColor: 'black',
    marginTop: 15,
  },
  btnTxt: {
    fontSize: 16,
    color: 'white',
  },
  btnContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
});

export default App;

```

<!-- ## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow. -->

## License

MIT

---

Made with [ffmpeg-kit-react-native](https://www.npmjs.com/package/ffmpeg-kit-react-native)
