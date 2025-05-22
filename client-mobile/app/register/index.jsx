import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import { URL_ANDROID } from "@env";
import Colors from "../../constants/Colors";

export default function EmailRegistration() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Email validation function
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async () => {
    // Clear previous errors
    setError("");
    
    // Validate email
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
  
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
  
    try {
      setIsLoading(true);
      
      // Verify URL_ANDROID is correctly set
      console.log("API URL:", `${URL_ANDROID}/account/check-email`);
      
      // First check if email already exists
      const response = await axios.post(`${URL_ANDROID}/account/check-email`, {
        email: email.toLowerCase()
      });
      
      console.log("API Response:", response.data);
      
      // If successful, navigate to OTP verification screen
      router.push({
        pathname: "/register/verify-otp",
        params: { email: email.toLowerCase() }
      });
      
    } catch (error) {
      console.error("Full error details:", error);
      
      if (error.response?.status === 409) {
        setError("This email is already registered");
      } else if (error.response) {
        // We have a response from the server with an error status
        setError(`Server error: ${error.response.data?.message || error.response.status}`);
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response from server. Check your connection.");
      } else {
        // Something happened in setting up the request
        setError(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Text style={styles.header}>REGISTER</Text>
        <Text style={styles.subText}>
          Enter your email address to start registration
        </Text>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputText}>Email Address</Text>
          <View style={styles.fieldStyle}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Sending..." : "Continue"}
          </Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/logintab")}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 50,
  },
  header: {
    fontSize: 25,
    textTransform: "uppercase",
    textAlign: "center",
    color: Colors.blackColorText,
    fontFamily: "GT Easti Bold",
    fontWeight: "900",
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    textAlign: "center",
    color: Colors.grey,
    marginBottom: 30,
    fontFamily: "GT Easti Bold",
  },
  inputWrapper: {
    marginBottom: 15,
  },
  inputText: {
    fontSize: 15,
    color: Colors.blackColorText,
    fontWeight: "700",
    marginBottom: 10,
    fontFamily: "GT Easti Bold",
  },
  fieldStyle: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    fontFamily: "Roboto Regular",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#FF5533",
    padding: 15,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: "#ffaa99",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "GT Easti Bold",
  },
  error: {
    color: "red",
    fontStyle: "italic",
    marginTop: 5,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    color: Colors.grey,
    fontFamily: "GT Easti Regular",
    marginTop: 4.5,
  },
  loginLink: {
    color: "#FF5533",
    fontWeight: "bold",
    fontFamily: "GT Easti Bold",
  }
});