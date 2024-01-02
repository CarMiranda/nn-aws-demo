import React from "react";
import FeatureCard from "../components/FeatureCard";
import { StyleSheet, View, ScrollView } from "react-native";

const icons = {
  classification: require("../assets/images/logo-classification.png"),
  object_detection: require("../assets/images/logo-detection.png"),
  ocr: require("../assets/images/logo-ocr.png"),
  segmentation: require("../assets/images/segmentation-logo.png"),
}

const availableApps = [
  {title: "Classification", icon: icons.classification},
  {title: "Detection", icon: icons.object_detection},
  {title: "OCR", icon: icons.ocr},
  {title: "Segmentation", icon: icons.segmentation},
]

export default function HomeScreen(): React.JSX.Element {

  const apps = [];
  let i = 0;
  for (const app of availableApps) {
    apps.push(
      <FeatureCard key={i} title={app.title} icon={app.icon} />
    );
    i++;
  }

  return (
    <ScrollView contentContainerStyle={{alignItems: "center"}} style={{flex: 1}}>
      <View style={styles.cardGrid}>
        {apps}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  cardGrid: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 20,
    columnGap: 0,
  },
});
