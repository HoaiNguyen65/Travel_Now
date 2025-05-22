import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Pressable } from "react-native";
import { useState, useContext } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { URL_ANDROID } from "@env";
import Colors from "../../constants/Colors";
import { Context } from "../../context/ContextProvider";
import { Entypo } from "@expo/vector-icons";

export default function CompleteRegistration() {
    const router = useRouter();
    const { email } = useLocalSearchParams();
    const { alert } = useContext(Context);
    const [isLoading, setIsLoading] = useState(false);

    const [userData, setUserData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        firstname: "",
        lastname: "",
        phone: "",
        gender: "male",
        DOB: "",
    });

    const [errors, setErrors] = useState({});
    const [hidePassword, setHidePassword] = useState(true);
    const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

    const validateForm = () => {
        let formErrors = {};

        // Username validation
        if (!userData.username.trim()) {
            formErrors.username = "Username is required";
        } else if (userData.username.length < 3) {
            formErrors.username = "Username must be at least 3 characters";
        }

        // Password validation
        if (!userData.password) {
            formErrors.password = "Password is required";
        } else if (userData.password.length < 6) {
            formErrors.password = "Password must be at least 6 characters";
        }

        // Confirm password
        if (userData.password !== userData.confirmPassword) {
            formErrors.confirmPassword = "Passwords do not match";
        }

        // Name validation
        if (!userData.firstname.trim()) {
            formErrors.firstname = "First name is required";
        }

        if (!userData.lastname.trim()) {
            formErrors.lastname = "Last name is required";
        }

        // Phone validation
        if (userData.phone && !/^\d{10,15}$/.test(userData.phone)) {
            formErrors.phone = "Please enter a valid phone number";
        }

        // Date of Birth validation
        if (!userData.DOB.trim()) {
            formErrors.DOB = "Date of Birth is required";
        } else if (!/^\d{4}-\d{2}-\d{2}$/.test(userData.DOB)) {
            formErrors.DOB = "Please enter a valid date (YYYY-MM-DD)";
        } else {
            // Optional: Additional validation for a realistic date
            const date = new Date(userData.DOB);
            const today = new Date();
            if (isNaN(date.getTime())) {
                formErrors.DOB = "Invalid date";
            } else if (date >= today) {
                formErrors.DOB = "Date of Birth must be in the past";
            }
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                setIsLoading(true);
    
                // Generate a random account code
                const accountCode = "AC" + Math.floor(100000 + Math.random() * 900000);
    
                const response = await axios.post(`${URL_ANDROID}/account/register`, {
                    ...userData,
                    email: email,
                    accountCode: accountCode,
                    role: "customer",
                    avatar: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                });
    
                if (response.data.success) {
                    // Navigate to AvatarSelection with userId
                    router.push({
                        pathname: "/register/avatarSelection",
                        params: { userId: response.data.user.id }
                    });
                }
            } catch (error) {
                const message = error.response?.data?.message || "Registration failed. Please try again.";
                alert("Error", message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleInputChange = (field, value) => {
        setUserData({
            ...userData,
            [field]: value
        });

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors({
                ...errors,
                [field]: ""
            });
        }
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <Text style={styles.header}>COMPLETE REGISTRATION</Text>
                <Text style={styles.subText}>
                    Fill in your details to complete registration for {email}
                </Text>

                {/* Username */}
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputText}>Username</Text>
                    <View style={styles.fieldStyle}>
                        <TextInput
                            value={userData.username}
                            onChangeText={(text) => handleInputChange("username", text)}
                            placeholder="Choose a username"
                            style={styles.input}
                            autoCapitalize="none"
                        />
                    </View>
                    {errors.username ? <Text style={styles.error}>{errors.username}</Text> : null}
                </View>

                {/* Password */}
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputText}>Password</Text>
                    <View style={styles.fieldStyle}>
                        <TextInput
                            value={userData.password}
                            onChangeText={(text) => handleInputChange("password", text)}
                            placeholder="Enter your password"
                            style={styles.input}
                            secureTextEntry={hidePassword}
                        />
                        <Entypo
                            onPress={() => setHidePassword(!hidePassword)}
                            name={hidePassword ? "eye-with-line" : "eye"}
                            size={26}
                            color={Colors.grey}
                            style={{ marginRight: 10 }}
                        />
                    </View>
                    {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}
                </View>

                {/* Confirm Password */}
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputText}>Confirm Password</Text>
                    <View style={styles.fieldStyle}>
                        <TextInput
                            value={userData.confirmPassword}
                            onChangeText={(text) => handleInputChange("confirmPassword", text)}
                            placeholder="Confirm your password"
                            style={styles.input}
                            secureTextEntry={hideConfirmPassword}
                        />
                        <Entypo
                            onPress={() => setHideConfirmPassword(!hideConfirmPassword)}
                            name={hideConfirmPassword ? "eye-with-line" : "eye"}
                            size={26}
                            color={Colors.grey}
                            style={{ marginRight: 10 }}
                        />
                    </View>
                    {errors.confirmPassword ? <Text style={styles.error}>{errors.confirmPassword}</Text> : null}
                </View>

                {/* First Name */}
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputText}>First Name</Text>
                    <View style={styles.fieldStyle}>
                        <TextInput
                            value={userData.firstname}
                            onChangeText={(text) => handleInputChange("firstname", text)}
                            placeholder="Enter your first name"
                            style={styles.input}
                        />
                    </View>
                    {errors.firstname ? <Text style={styles.error}>{errors.firstname}</Text> : null}
                </View>

                {/* Last Name */}
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputText}>Last Name</Text>
                    <View style={styles.fieldStyle}>
                        <TextInput
                            value={userData.lastname}
                            onChangeText={(text) => handleInputChange("lastname", text)}
                            placeholder="Enter your last name"
                            style={styles.input}
                        />
                    </View>
                    {errors.lastname ? <Text style={styles.error}>{errors.lastname}</Text> : null}
                </View>

                {/* Phone */}
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputText}>Phone Number (Optional)</Text>
                    <View style={styles.fieldStyle}>
                        <TextInput
                            value={userData.phone}
                            onChangeText={(text) => handleInputChange("phone", text)}
                            placeholder="Enter your phone number"
                            style={styles.input}
                            keyboardType="phone-pad"
                        />
                    </View>
                    {errors.phone ? <Text style={styles.error}>{errors.phone}</Text> : null}
                </View>

                {/* Gender Selection */}
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputText}>Gender</Text>
                    <View style={styles.genderContainer}>
                        <Pressable
                            style={[
                                styles.genderButton,
                                userData.gender === "male" && styles.genderButtonSelected
                            ]}
                            onPress={() => handleInputChange("gender", "male")}
                        >
                            <Text style={[
                                styles.genderText,
                                userData.gender === "male" && styles.genderTextSelected
                            ]}>Male</Text>
                        </Pressable>
                        <Pressable
                            style={[
                                styles.genderButton,
                                userData.gender === "female" && styles.genderButtonSelected
                            ]}
                            onPress={() => handleInputChange("gender", "female")}
                        >
                            <Text style={[
                                styles.genderText,
                                userData.gender === "female" && styles.genderTextSelected
                            ]}>Female</Text>
                        </Pressable>
                        <Pressable
                            style={[
                                styles.genderButton,
                                userData.gender === "other" && styles.genderButtonSelected
                            ]}
                            onPress={() => handleInputChange("gender", "other")}
                        >
                            <Text style={[
                                styles.genderText,
                                userData.gender === "other" && styles.genderTextSelected
                            ]}>Other</Text>
                        </Pressable>
                    </View>
                </View>

                {/* Date of Birth */}
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputText}>Date of Birth</Text>
                    <View style={styles.fieldStyle}>
                        <TextInput
                            value={userData.DOB}
                            onChangeText={(text) => handleInputChange("DOB", text)}
                            placeholder="YYYY-MM-DD (e.g., 1990-05-15)"
                            style={styles.input}
                            keyboardType="numeric"
                        />
                    </View>
                    {errors.DOB ? <Text style={styles.error}>{errors.DOB}</Text> : null}
                </View>

                <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? "Registering..." : "Register"}
                    </Text>
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
        paddingBottom: 30,
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
        marginBottom: 20,
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
    genderContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    genderButton: {
        flex: 1,
        padding: 12,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 15,
        alignItems: "center",
        marginHorizontal: 5,
    },
    genderButtonSelected: {
        backgroundColor: "#FF5533",
        borderColor: "#FF5533",
    },
    genderText: {
        color: Colors.blackColorText,
        fontFamily: "GT Easti Bold",
    },
    genderTextSelected: {
        color: "#fff",
    },
});