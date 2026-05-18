import React from "react";
import Svg, { Path } from "react-native-svg";

interface ArcCurveProps {
  color?: string;
  height?: number;
  style?: any;
}

export default function ArcCurve({
  color = "#F0F4F8",
  height = 24,
  style,
}: ArcCurveProps) {
  return (
    <Svg
      width="100%"
      height={height}
      viewBox="0 0 400 24"
      preserveAspectRatio="none"
      style={style}
    >
      <Path d="M0,24 Q200,-12 400,24 L400,24 L0,24 Z" fill={color} />
    </Svg>
  );
}
