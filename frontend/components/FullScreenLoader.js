import React from "react";
import { View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import loaderAnimation from '../assets/lottie/loading-tree.json';

const FullScreenLoader = ({ sourceImg = loaderAnimation, message = "Loading..." }) => {
  return (
    <View style={styles.container}>
      <LottieView
        source={sourceImg} 
        autoPlay
        loop
        style={styles.lottie}
      />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "hsla(0, 0%, 100%, 0.67)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },
  lottie: {
    width: 220,
    height: 220,
  },
  text: {
    fontSize: 14,
    color: "#6B4423",
    marginTop: 10,
  },
});

export default FullScreenLoader;
