import { Camera, CameraType} from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { store } from "../redux/store";
import { imageSet } from "../redux/reducers/analysis";
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { type ImageResult, manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export default function CameraScreen(): React.JSX.Element {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [canTakePicture, setCanTakePicture] = useState(true);
  const cameraRef: React.MutableRefObject<Camera | null> = useRef(null);
  const router = useRouter();
  const params = useGlobalSearchParams();

  useEffect(() => {
    if (cameraRef.current !== null) {
      if (params.confirmed !== undefined) {
        setCanTakePicture(false);
        cameraRef.current.pausePreview();
        delete params.confirmed;
        router.replace("/camera/results");
      } else {
        setCanTakePicture(true);
        cameraRef.current.resumePreview();
      }
    }
  }, [canTakePicture, cameraRef, params, router]);

  async function resize(uri: string): Promise<ImageResult> {
    if (!uri.startsWith("data:")) {
      uri = `data:image/png,base64${uri}`;
    }
    const manipResult = await manipulateAsync(
      uri, [{resize: {height: 512}}], {format: SaveFormat.PNG},
    );
    return manipResult;
  }

  function takePicture(): void {
    if (cameraRef.current !== null) {
      setCanTakePicture(false);
      cameraRef.current.takePictureAsync({ base64: true})
        .then((data) => {
          const resizedImage = data;
          const image = {
            data: resizedImage.base64,
            width: resizedImage.width,
            height: resizedImage.height,
          };
          store.dispatch(imageSet({image}));
          router.push("/camera/confirmation");
          setCanTakePicture(true);
        })
        .catch((err) => {
          console.error("Could not take picture!", err);
        });
    }
  }

  if (permission === null) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function oncameraready(): void {
    console.log(cameraRef.current?.getAvailablePictureSizesAsync("4:3").then(r => r));
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={CameraType.back} ref={cameraRef} pictureSize="1280x960" onCameraReady={oncameraready}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cameraButton} disabled={!canTakePicture} onPress={takePicture}>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    alignItems: "center",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 64,
    minWidth: 100,
  },
  cameraButton: {
    flex: 1,
    alignSelf: 'flex-end',
    maxWidth: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "white",
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

