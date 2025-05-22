import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useContext, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useRouter, useLocalSearchParams } from "expo-router";
import { URL_ANDROID } from "@env";
import axios from "axios";
import { Context } from "../../context/ContextProvider";
import * as ImagePicker from 'expo-image-picker';

function AvatarSelection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const { alert } = useContext(Context);

  const handlePickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.8,
    });
  
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleUpdateAvatar = async () => {
    if (!selectedImage) return;
    
    try {
      setIsLoading(true);
      
      // Create form data for image upload
      const formData = new FormData();
      
      // Get the image name from the URI
      const imageName = selectedImage.split('/').pop();
      
      // Add the image to form data
      formData.append('image', {
        uri: selectedImage,
        name: imageName,
        type: 'image/jpeg' // Adjust if needed based on the image type
      });
      
      // First upload the image
      const uploadResponse = await fetch(`${URL_ANDROID}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const uploadData = await uploadResponse.json();
      
      if (!uploadData.success) {
        throw new Error('Failed to upload image');
      }
      
      // Update user's avatar with the image URL
      const avatarUrl = uploadData.imagePath || uploadData.thumbnailPath;
      
      await axios.put(`${URL_ANDROID}/account/${userId}`, {
        avatar: avatarUrl,
      });
      
      alert("Success", "Avatar updated successfully", () => {
        router.push("/logintab");
      });
    } catch (error) {
      console.error("Error updating avatar:", error);
      alert("Error", "Failed to update avatar. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Avatar</Text>

      <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        ) : (
          <View style={{ alignItems: "center", gap: 8 }}>
            <MaterialCommunityIcons
              name="image-plus"
              size={42}
              color={Colors.grey}
            />
            <Text
              style={{
                fontFamily: "GT Easti Medium",
                fontSize: 16,
                color: Colors.grey,
              }}
            >
              Choose Image
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: selectedImage ? (isLoading ? Colors.grey : "#FF5533") : Colors.grey },
          ]}
          onPress={handleUpdateAvatar}
          disabled={!selectedImage || isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Updating..." : "Apply"}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          position: "absolute",
          width: "100%",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          bottom: 32,
          right: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            router.push("/logintab");
          }}
        >
          <Text style={styles.skipBtn}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    fontFamily: "GT Easti Bold",
  },
  skipBtn: {
    color: Colors.blue,
    fontSize: 18,
    fontFamily: "GT Easti Bold",
  },
  imagePicker: {
    width: 150,
    height: 150,
    backgroundColor: "#e0e0e0",
    borderRadius: 75,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    borderWidth: 2,
    borderColor: "#ccc",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 75,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 10,
    width: "80%",
    alignItems: "center",
    height: 50,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "GT Easti Bold",
  },
});

export default AvatarSelection;