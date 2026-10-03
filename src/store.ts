import AsyncStorage from "@react-native-async-storage/async-storage";
import { parseBox, type BoxState } from "./box";

const KEY = "key-for-the-box-v1";

export async function loadBox(): Promise<BoxState> {
  const raw = await AsyncStorage.getItem(KEY);
  return parseBox(raw);
}

export async function saveBox(state: BoxState): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(state));
}
