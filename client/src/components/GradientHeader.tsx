import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle } from "react-native-svg";
import ArcCurve from "./ArcCurve";

interface GradientHeaderProps {
  title: string;
  subtitle?: string;
  englishTitle?: string;
  motto?: string;
  showArc?: boolean;
  showDashedRings?: boolean;
  rightElement?: React.ReactNode;
  arcColor?: string;
}

export default function GradientHeader({
  title,
  subtitle,
  englishTitle,
  motto,
  showArc = true,
  showDashedRings = true,
  rightElement,
  arcColor = "#F0F4F8",
}: GradientHeaderProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1a3350", "#1e3a5f", "#2d5a87"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.gradient}
      >
        {showDashedRings && (
          <View style={styles.ringContainer}>
            <Svg height="200" width="200" style={styles.ringOuter}>
              <Circle
                cx="100"
                cy="100"
                r="90"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="2"
                strokeDasharray="4,4"
                fill="none"
              />
            </Svg>
            <Svg height="130" width="130" style={styles.ringInner}>
              <Circle
                cx="65"
                cy="65"
                r="55"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1.5"
                strokeDasharray="4,4"
                fill="none"
              />
            </Svg>
          </View>
        )}

        <View style={styles.content}>
          {englishTitle && (
            <Text style={styles.englishTitle}>{englishTitle}</Text>
          )}
          <View style={styles.titleRow}>
            <Text style={styles.title}>{title}</Text>
            {rightElement}
          </View>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          {motto && <Text style={styles.motto}>{motto}</Text>}
        </View>

        {showArc && (
          <View style={styles.arcWrapper}>
            <ArcCurve color={arcColor} />
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  gradient: {
    paddingTop: 50,
    paddingBottom: 0,
    paddingHorizontal: 24,
    position: "relative",
    overflow: "hidden",
  },
  ringContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 200,
    height: 200,
  },
  ringOuter: { position: "absolute", top: -60, right: -40 },
  ringInner: { position: "absolute", top: -20, right: 0 },
  content: { position: "relative", zIndex: 1, paddingBottom: 40 },
  englishTitle: {
    fontSize: 10,
    color: "rgba(255,255,255,0.45)",
    letterSpacing: 2,
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 2,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
  },
  motto: {
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
    letterSpacing: 3,
    marginTop: 2,
  },
  arcWrapper: {
    position: "absolute",
    bottom: 0,
    left: "-5%",
    width: "110%",
    height: 24,
  },
});
