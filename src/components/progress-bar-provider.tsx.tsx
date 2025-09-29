"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import React, { ReactNode } from "react";

const ProgressBarProvider = ({ children }: {children: ReactNode}) => {
  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color="#fffd00"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
};

export default ProgressBarProvider;
