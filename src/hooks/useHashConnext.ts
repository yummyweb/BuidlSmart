import React from "react"
import { HashConnectAPIContext } from "../HashConnectAPIProvider";

export function useHashConnect() {
    const value = React.useContext(HashConnectAPIContext);
    return value;
}