"use client";

import * as React from "react";

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  forcedTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}) {
  return <>{children}</>;
}
