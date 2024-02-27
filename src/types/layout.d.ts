import "next";
import type { NextPage } from "next";
import type React from "react";

declare module "next" {
  export type NextLayout<P = Record<string, unknown>> = NextPage<P> & {
    getLayout?: (
      page: React.ReactNode,
      permission?: string[]
    ) => React.ReactNode;
  };
}