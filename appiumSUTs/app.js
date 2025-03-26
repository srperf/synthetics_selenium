import React, { useState } from "react";
import { View, Text, Button, TextInput, Switch, Picker, Alert } from "react-native";

export default function App() {
  const [inputValue, setInputValue] = useState("");
  const [isSwitchOn, setSwitchOn] = useState(false);
  const [selectedValue, setSelectedValue] = useState("option1");

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}>
      
      {/* Text */}
      <Text testID="welcomeText">Welcome to the App!</Text>

      {/* Button */}
      <Button title="Press Me" onPress={() => Alert.alert("Button Pressed!")} testID="alertButton" />

      {/* Text Input */}
      <TextInput
        testID="textInput"
        style={{ borderWidth: 1, width: 200, padding: 10, marginVertical: 10 }}
        placeholder="Enter text"
        value={inputValue}
        onChangeText={setInputValue}
      />

      {/* Switch */}
      <Switch testID="toggleSwitch" value={isSwitchOn} onValueChange={() => setSwitchOn(!isSwitchOn)} />

      {/* Dropdown */}
      <Picker
        testID="dropdownPicker"
        selectedValue={selectedValue}
        style={{ height: 50, width: 200, marginVertical: 10 }}
        onValueChange={(itemValue) => setSelectedValue(itemValue)}
      >
        <Picker.Item label="Option 1" value="option1" />
        <Picker.Item label="Option 2" value="option2" />
        <Picker.Item label="Option 3" value="option3" />
      </Picker>

      {/* Submitted Text */}
      {inputValue ? <Text testID="submittedText">You entered: {inputValue}</Text> : null}
    </View>
  );
}
