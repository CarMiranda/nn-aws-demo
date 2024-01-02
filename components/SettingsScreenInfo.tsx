import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "./Themed";
import { TextInput } from "react-native-gesture-handler";
import { settingsUpdated, AWSRegion, type AWSSettings } from "../redux/reducers/settings";
import { store } from "../redux/store";

const subdomain1 = "execute-api";
const host = "amazonaws.com";

function getUrl(subdomain: string, region: AWSRegion, path: string): string {
  path = path.startsWith("/") ? path : "/" + path;
  const regionStr = getRegionValue(region);
  return [subdomain, subdomain1, regionStr, host].join(".") + path;
}
function getRegionEnum(awsRegion: string): AWSRegion {
  const id = Object.values(AWSRegion).indexOf(awsRegion as unknown as AWSRegion);
  const key = Object.keys(AWSRegion)[id];
  return AWSRegion[key]
}

function getRegionValue(awsRegion: AWSRegion): string {
  const id = Object.keys(AWSRegion).indexOf(awsRegion);
  const key = Object.values(AWSRegion)[id];
  return key
}

export default function SettingsScreenInfo(): React.JSX.Element {

  const [appSubdomain, setAppSubdomain] = useState(store.getState().settings.appSubdomain);
  const [region, setRegion] = useState(store.getState().settings.region);
  const [path, setPath] = useState(store.getState().settings.path);
  // const [errorMessage, setErrorMessage] = useState("");

  const updateSettings = ({appSubdomain, region, path}: AWSSettings): void => {
    // const awsUrl = getUrl(appSubdomain, region, path);
    store.dispatch(settingsUpdated({appSubdomain, region, path}));
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputView}>
        <Text style={styles.inputLabel}>
          App subdomain
        </Text>
        <TextInput
          autoFocus
          style={styles.textInput}
          value={appSubdomain}
          onChangeText={setAppSubdomain}
          autoCapitalize="none"
          returnKeyType="next"
        />
      </View>
      <View style={styles.inputView}>
        <Text style={styles.inputLabel}>
          Region
        </Text>
        <TextInput
          style={styles.textInput}
          value={region}
          onChangeText={content => { setRegion(getRegionEnum(content)); }}
          autoCapitalize="none"
          returnKeyType="next"
        />
      </View>
      <View style={styles.inputView}>
        <Text style={styles.inputLabel}>
          Path
        </Text>
        <TextInput
          style={styles.textInput}
          value={path}
          onChangeText={setPath}
          autoCapitalize="none"
          returnKeyType="next"
        />
      </View>
      <View style={styles.inputView}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={_ => { updateSettings({appSubdomain, region, path}); }}
        >
          <Text style={styles.loginButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    overflow: "scroll",
  },
  inputLabel: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  inputView: {
    width: "80%",
    marginBottom: 20,
    alignItems: "center",
  },
  textInput: {
    borderRadius: 0,
    backgroundColor: "#fff",
    borderColor: "#999",
    borderWidth: 1,
    fontSize: 20,
    flex: 1,
    padding: 15,
    width: "100%",
  },
  loginButton: {
    width: "50%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#ffba24",
  },
  loginButtonText: {
    color: "#333",
    fontSize: 20,
  }
});
