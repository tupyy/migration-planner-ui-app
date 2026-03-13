import { css } from "@emotion/css";
import React from "react";

import { SVGIcon } from "../components/SVGIcon";

const classes = {
  root: css({
    width: "3rem",
    height: "3rem",
  }),
};

export const OpenShiftIcon: React.FC = () => (
  <SVGIcon className={classes.root} viewBox="0 0 38 38">
    {/* Background rounded square */}
    <rect x="0" y="0" width="38" height="38" rx="7.6" fill="black" />
    {/* Red circular arcs */}
    <path
      d="M 11.4 19 A 7.6 7.6 0 0 1 26.6 19"
      fill="none"
      stroke="#CC0000"
      strokeWidth="1.52"
    />
    <path
      d="M 11.4 19 A 7.6 7.6 0 0 0 26.6 19"
      fill="none"
      stroke="#CC0000"
      strokeWidth="1.52"
      strokeDasharray="11.4 3.8"
    />
    {/* White diagonal lines */}
    <line x1="10.45" y1="21.85" x2="14.25" y2="19.95" stroke="white" strokeWidth="1.52" />
    <line x1="10.45" y1="24.7" x2="14.25" y2="22.8" stroke="white" strokeWidth="1.52" />
    <line x1="23.75" y1="15.2" x2="27.55" y2="13.3" stroke="white" strokeWidth="1.52" />
    <line x1="23.75" y1="18.05" x2="27.55" y2="16.15" stroke="white" strokeWidth="1.52" />
  </SVGIcon>
);

OpenShiftIcon.displayName = "OpenShiftIcon";
