import React from 'react';
import LoginScreenInfo from '../components/LoginScreenInfo';
import { store } from "../redux/store";
import { Redirect } from "expo-router";

export default function LoginScreen(): React.JSX.Element {
  const isLoggedIn = store.getState().user.name !== "";

  return (
    !isLoggedIn ? <Redirect href="/home" /> : <LoginScreenInfo />
  )
}
