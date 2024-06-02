// ColorContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ColorContext = createContext();

export const ColorProvider = ({ children }) => {
  const [selectedColor, setSelectedColor] = useState("#3e0461");
  const COLOR_OPTIONS = ["#FF5733", "#33FF57", "#3357FF", "#F333FF", "#FF33F4"];

  useEffect(() => {
    const loadColor = async () => {
      try {
        const color = await AsyncStorage.getItem("selectedColor");
        if (color) {
          setSelectedColor(color);
        }
      } catch (error) {
        console.error("Failed to load the color from storage");
      }
    };

    loadColor();
  }, []);

  const handleColorChange = async (color) => {
    try {
      await AsyncStorage.setItem("selectedColor", color);
      setSelectedColor(color);
    } catch (error) {
      console.error("Failed to save the color to storage");
    }
  };

  return (
    <ColorContext.Provider
      value={{ selectedColor, handleColorChange, COLOR_OPTIONS }}
    >
      {children}
    </ColorContext.Provider>
  );
};
