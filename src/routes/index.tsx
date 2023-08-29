import { NavigationContainer } from "@react-navigation/native";
import { AppRoutes } from "./app.routes";

export function Route() {
  return (
    <NavigationContainer>
      <AppRoutes />
    </NavigationContainer>
  )
}