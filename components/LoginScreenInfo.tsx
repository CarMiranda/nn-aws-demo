import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "./Themed";
import { useRouter } from "expo-router";
import { TextInput } from "react-native-gesture-handler";
import { userLoggedIn } from "../redux/reducers/user";

const icons = {
  logo: require("../assets/images/app-logo.png"),
}

const allowedUsers = [
  {
    name: "carlos",
    password: "carlos",
  },
  {
    name: "salma",
    password: "salma",
  }
];

export default function LoginScreenInfo(): React.JSX.Element {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  
  const login = (loginName: string, loginPassword: string): void => {
    for (const {name, password} of allowedUsers) {
      if ((loginName === name) && (loginPassword === password)) {
        setIsLoggedIn(true);
        userLoggedIn({name});
        break;
      }
    }

    if (isLoggedIn) {
      router.replace("/home");
    } else {
      setErrorMessage("Invalid username or password.");
    }
  }


  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={icons.logo} style={styles.logo} />
      </View>
      <View style={styles.inputView}>
        <TextInput
          autoFocus
          style={styles.textInput}
          value={name}
          onChangeText={content => { setName(content); }}
          placeholder="Username"
          autoCapitalize="none"
          returnKeyType="next"
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          secureTextEntry
          style={styles.textInput}
          value={password}
          onChangeText={content => { setPassword(content); }}
          placeholder="Password"
          autoCapitalize="none"
          returnKeyType="go"
        />
        <Text>{errorMessage}</Text>
      </View>
      <View style={styles.inputView}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={_ => { login(name, password); }}
        >
          <Text style={styles.loginButtonText}>Login</Text>
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
  logoContainer: {
    width: 100,
    height: 100,
    marginBottom: 40,
    backgroundColor: "#ffba24",
    borderRadius: 100,
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 75,
    height: 75,
    transform: [{rotateZ: "330deg"}],
  },
  inputView: {
    width: "80%",
    marginBottom: 20,
    alignItems: "center",
  },
  textInput: {
    borderRadius: 25,
    backgroundColor: "#fff",
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
