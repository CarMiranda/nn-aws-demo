import { TouchableOpacity } from "react-native-gesture-handler";
import { Text, View } from "../../components/Themed";
import { store } from "../../redux/store";
import { Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import React from "react";

export default function ConfirmationScreen(): React.JSX.Element {
  const {data, width, height} = store.getState().analysis.image;
  const router = useRouter();
  let uri = data;
  if (!uri.startsWith("data:")) {
    uri = `data:image/png;base64,${data}`;
  }

  function validate(): void {
    router.push({pathname: "/camera/cameraView", params: {confirmed: "true"}});
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image style={{flex: 1, width: "100%", height: "100%"}} resizeMode="contain" source={{uri}} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.confirmButton} onPress={validate}>
          <Text style={styles.confirmButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "scroll",
  },
  imageContainer: {
    flex: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  confirmButton: {
    flex: 1,
    minWidth: "50%",
    borderRadius: 25,
    marginTop: 40,
    maxHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffba24",
  },
  confirmButtonText: {
    color: "#333",
    fontSize: 20,
  }
});
