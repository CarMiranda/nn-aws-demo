import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, Image, Text, StyleSheet, type ImageURISource } from "react-native";


interface FeatureCardProps {
  title: string,
  icon: ImageURISource,
}

export default function FeatureCard({title, icon}: FeatureCardProps): React.JSX.Element {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => { router.push("/camera/cameraView"); }}
    >
      <Image source={icon} style={styles.cardIcon} />
      <Text style={styles.cardTitle}>{title}</Text>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffba24",
    borderBottomColor: "#fff",
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "40%",
  },
  cardIcon: {
    height: 80,
    width: 80,
    marginTop: 20,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 20,
  },
})
