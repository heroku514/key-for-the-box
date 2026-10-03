import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import {
  boxLine,
  EMPTY_BOX,
  hasProgress,
  keyLine,
  openBox,
  putKey,
  resetBox,
  shutBox,
  takeKey,
  type BoxState,
} from "./src/box";
import { loadBox, saveBox } from "./src/store";

export default function App() {
  const [state, setState] = useState<BoxState>(EMPTY_BOX);
  const [note, setNote] = useState("Look at the box.");
  const [ready, setReady] = useState(false);
  const [confirmNew, setConfirmNew] = useState(false);

  useEffect(() => {
    let alive = true;
    loadBox()
      .then((loaded) => {
        if (!alive) return;
        setState(loaded);
        setNote(hasProgress(loaded) ? "Saved box loaded." : "Look at the box.");
        setReady(true);
      })
      .catch(() => {
        if (alive) setNote("Could not read the box.");
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveBox(state).catch(() => setNote("Could not save the box."));
  }, [ready, state]);

  if (!ready && note === "Look at the box.") {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.loading}>Loading the box</Text>
        </View>
      </SafeAreaView>
    );
  }

  function apply(result: { state: BoxState; note: string }) {
    setState(result.state);
    setConfirmNew(false);
    setNote(result.note);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <Text style={styles.title}>Key for the Box</Text>
        <Text style={styles.note}>{note}</Text>
        <Text style={styles.count}>{keyLine(state)}</Text>
        <Text style={styles.line}>{boxLine(state)}</Text>
        <View style={styles.row}>
          <BigButton label="Put the key in" inRow onPress={() => apply(putKey(state))} />
          <BigButton label="Take the key out" inRow onPress={() => apply(takeKey(state))} />
        </View>
        <View style={styles.row}>
          <BigButton label="Open the box" inRow onPress={() => apply(openBox(state))} />
          <BigButton label="Shut the box" inRow onPress={() => apply(shutBox(state))} />
        </View>
        {confirmNew ? (
          <View style={styles.row}>
            <BigButton label="Confirm new" filled inRow onPress={onConfirmNew} />
            <BigButton label="Cancel new" inRow onPress={onCancelNew} />
          </View>
        ) : (
          <BigButton label="New box" onPress={() => setConfirmNew(true)} />
        )}
      </View>
    </SafeAreaView>
  );

  function onConfirmNew() {
    const result = resetBox();
    setState(result.state);
    setConfirmNew(false);
    setNote(result.note);
  }

  function onCancelNew() {
    setConfirmNew(false);
    setNote("New box canceled.");
  }
}

function BigButton({
  label,
  onPress,
  filled,
  inRow,
}: {
  label: string;
  onPress: () => void;
  filled?: boolean;
  inRow?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.button, inRow && styles.buttonRow, filled && styles.buttonFilled]}
    >
      <Text style={[styles.buttonText, filled && styles.buttonTextFilled]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F6EFE4" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  loading: { fontSize: 28, fontWeight: "800", color: "#3F2E22" },
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 8, gap: 8 },
  title: { fontSize: 32, fontWeight: "800", color: "#3F2E22" },
  note: { fontSize: 18, color: "#6B5344", minHeight: 24 },
  count: { fontSize: 22, fontWeight: "700", color: "#3F2E22" },
  line: { fontSize: 34, fontWeight: "800", color: "#8A4B2A", lineHeight: 40 },
  row: { flexDirection: "row", gap: 8 },
  button: {
    minHeight: 60,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#3F2E22",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    backgroundColor: "#FFFFFF",
  },
  buttonRow: { flex: 1 },
  buttonFilled: { backgroundColor: "#3F2E22" },
  buttonText: { fontSize: 18, fontWeight: "800", color: "#3F2E22", textAlign: "center" },
  buttonTextFilled: { color: "#FFFFFF" },
});
