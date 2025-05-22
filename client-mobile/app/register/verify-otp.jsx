import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useState, useContext } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import { URL_ANDROID } from "@env";
import Colors from "../../constants/Colors";
import { useLocalSearchParams } from "expo-router";
import { Context } from "../../context/ContextProvider";

export default function VerifyRegistrationOTP() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { email } = useLocalSearchParams();
  const { alert } = useContext(Context);
  
  const handleSubmit = async () => {
    if (!otp.trim()) {
      setError("Please enter the verification code");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await axios.post(`${URL_ANDROID}/account/verify-email-otp`, {
        email,
        otp
      });
      
      if (response.data.success) {
        // Navigate to the complete registration screen
        router.push({
          pathname: "/register/complete",
          params: { email }
        });
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsLoading(true);
      await axios.post(`${URL_ANDROID}/account/check-email`, {
        email
      });
      alert("Success", "A new verification code has been sent to your email");
    } catch (error) {
      alert("Error", "Failed to resend verification code. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Text style={styles.header}>VERIFY YOUR EMAIL</Text>
        <Text style={styles.subText}>
          We've sent a verification code to {email}
        </Text>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputText}>Verification Code</Text>
          <View style={styles.fieldStyle}>
            <TextInput
              value={otp}
              onChangeText={setOtp}
              placeholder="Enter OTP code"
              style={styles.input}
              keyboardType="number-pad"
              maxLength={6}
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
            {isLoading ? "Verifying..." : "Verify"}
          </Text>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          <TouchableOpacity onPress={handleResendOTP} disabled={isLoading}>
            <Text style={[styles.resendButton, isLoading && styles.resendButtonDisabled]}>
              Resend
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Change Email</Text>
        </TouchableOpacity>
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
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  resendText: {
    color: Colors.grey,
    fontFamily: "GT Easti Regular",
    marginTop: 4.5,
  },
  resendButton: {
    color: "#FF5533",
    fontWeight: "bold",
    fontFamily: "GT Easti Bold",
  },
  resendButtonDisabled: {
    color: "#ffaa99",
  },
  backButton: {
    alignItems: "center",
    marginTop: 15,
    padding: 10,
  },
  backButtonText: {
    color: Colors.blue,
    fontFamily: "GT Easti Bold",
    fontStyle: "italic",
  }
});