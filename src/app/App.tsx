import React from "react";
import "./App.css";
import { SnackbarProvider } from "notistack";
import Router from "@/router";

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Router />
    </SnackbarProvider>
  );
}

export default App;
