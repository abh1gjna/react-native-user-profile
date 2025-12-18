
import React, { useState } from "react";
import { Image } from "react-native";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const isValidDate = (day, month, year) => {  //checks if date is valid or not
  if (!day || !month || !year) return false;

  const d = Number(day);
  const y = Number(year);

  if (d < 1 || y < 1900 || y > new Date().getFullYear()) return false;

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const monthIndex = months.indexOf(month);
  if (monthIndex === -1) return false;

  const testDate = new Date(y, monthIndex, d);

  return (
    testDate.getFullYear() === y &&
    testDate.getMonth() === monthIndex &&
    testDate.getDate() === d
  );
};

export default function App() {

const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [phone, setPhone] = useState("");
const [email, setEmail] = useState("");
const [day, setDay] = useState("");
const [month, setMonth] = useState("");
const [year, setYear] = useState("");
const [gender, setGender] = useState("");
const [genderOpen, setGenderOpen] = useState(false);
const [genderOpenUpwards, setGenderOpenUpwards] = useState(false);
const [imageUri, setImageUri] = useState(null);
const [monthOpen, setMonthOpen] = useState(false);
const [errors, setErrors] = useState({});


const pickImage = async () => { //to upload pfp
  Alert.alert(
    "Change Photo",
    "Select an option",
    [
      {
        text: "Choose from Gallery",
        onPress: async () => {
          let permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!permission.granted) {
            Alert.alert("Permission Denied", "Allow photo access to continue.");
            return;
          }

          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });

          if (!result.canceled) {
            setImageUri(result.assets[0].uri);
          }
        },
      },

      {
        text: "Remove Photo",
        onPress: () => setImageUri(null),
        style: "destructive",
      },

      { text: "Cancel", style: "cancel" },
    ]
  );
};
   const validate = (fields) => { // to check if each field is valid or not
  let errors = {};

  if (!fields.firstName.trim()) errors.firstName = "First name required";
  if (!fields.lastName.trim()) errors.lastName = "Last name required";

  if (!/^\d{10}$/.test(fields.phone))
    errors.phone = "Phone must be 10 digits";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
    errors.email = "Invalid email";

if (!isValidDate(fields.day, fields.month, fields.year)) {
  errors.dob = "Enter a valid date of birth (DD/MM/YYYY)";
}

  if (!fields.gender) errors.gender = "Select a gender";

  return errors;
};

  const onSave = () => {// check if data has been saved
    Alert.alert("Saved!", "Your data has been submitted!");
    console.log({
      firstName,
      lastName,
      phone,
      email,
      day,
      month,
      year,
      gender,
    });
  };

  const getInitials = () => {// gets intials from first and last name
  const f = firstName?.trim()?.charAt(0) || "";
  const l = lastName?.trim()?.charAt(0) || "";
  const initials = (f + l).toUpperCase();
  return initials || "?";
};

  return (
     <View style={{ flex: 1 }}> 
    <ScrollView contentContainerStyle={styles.container}>
{/* profile header */}
<View style={styles.photoSection}>

  <View style={styles.avatarWrapper}>
    {imageUri ? (
      <Image source={{ uri: imageUri }} style={styles.profileImage} />
    ) : (
      <View style={styles.solidAvatar}>
        <Text style={styles.avatarInitials}>{getInitials()}</Text>

      </View>
    )}

    <View style={styles.statusDot} />
  </View>

  <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
    <View style={styles.changePhotoButton}>
      <Text style={styles.changePhotoText}>Change Photo</Text>
    </View>
  </TouchableOpacity>

</View>


{/*first name*/}
     <Text style={styles.label}>First Name</Text>

<View style={styles.inputBox}>
  <Ionicons
    name="person-outline"
    size={20}
    color="#777"
    style={styles.iconInside}
  />

  <TextInput
    style={styles.inputInside}
    placeholder="John"
    value={firstName}
     onChangeText={(text) => {
    setFirstName(text);
    // removes error if now valid
    if (errors.firstName && text.trim() !== "") {
      setErrors((prev) => ({ ...prev, firstName: null }));
    }
  }}
  />
</View>
{errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}



      {/* last name */}
     <Text style={styles.label}>Last Name</Text>

<View style={styles.inputBox}>
  <Ionicons
    name="person-outline"
    size={20}
    color="#777"
    style={styles.iconInside}
  />

  <TextInput
    style={styles.inputInside}
    placeholder="Doe"
    value={lastName}
         onChangeText={(text) => {
    setLastName(text);

    // remove error if now valid
    if (errors.lastName && text.trim() !== "") {
      setErrors((prev) => ({ ...prev, lastName: null }));
    }
  }}
  />
</View>
{errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

{/*phone number*/}
<Text style={styles.label}>Mobile Number</Text>

<View style={styles.inputBox}>
  <Ionicons
    name="call-outline"
    size={20}
    color="#777"
    style={styles.iconInside}
  />

  <TextInput
    style={styles.inputInside}
    placeholder="Enter mobile number"
    keyboardType="numeric"
    value={phone}
onChangeText={(text) => {
  const cleaned = text.replace(/[^0-9]/g, "");
  setPhone(cleaned);
  // remove error if now valid
  if (errors.phone && /^\d{10}$/.test(cleaned)) {
    setErrors((prev) => ({ ...prev, phone: null }));
  }

  if (cleaned.length > 10) {
    setErrors((prev) => ({ ...prev, phone: "Phone must be 10 digits" }));
  }
}}


  />
</View>
{errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}


{/* email */}
<Text style={styles.label}>Email Address</Text>

<View style={styles.inputBox}>
  <Ionicons
    name="mail-outline"
    size={20}
    color="#777"
    style={styles.iconInside}
  />

  <TextInput
    style={styles.inputInside}
    placeholder="Enter email address"
    keyboardType="email-address"
    autoCapitalize="none"
    value={email}
    onChangeText={(text) => {
  setEmail(text);
  if (
    errors.email &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)
  ) {
    setErrors((prev) => ({ ...prev, email: null }));
  }
}}
  />
</View>
{errors.email && <Text style={styles.errorText}>{errors.email}</Text>}


      {/* dob */}
<Text style={styles.label}>Date of Birth</Text>

<View style={styles.dobRow}>

  {/* dd */}
  <TextInput
    style={[styles.input, styles.ddBox]}
    placeholder="DD"
    keyboardType="numeric"
    maxLength={2}
    value={day}
    onChangeText={(text) => {
  setDay(text);
  const valid = isValidDate(text, month, year);
if (errors.dob && valid) {
  setErrors((prev) => ({ ...prev, dob: null }));
}

}}


  />

  {/*month*/}
 <View style={styles.monthWrapper}>
 
  <TouchableOpacity
    style={styles.dropdownContainer}
    onPress={() => setMonthOpen(!monthOpen)}
    activeOpacity={0.7}
  >
    <View style={styles.dropdownHeader}>
      <Text style={styles.dropdownLabel}>{month || "MM"}</Text>
      <Ionicons name="chevron-down" size={20} />
    </View>
  </TouchableOpacity>

  {monthOpen && (
    <View style={styles.monthDropdownList}>
      <ScrollView nestedScrollEnabled>
        {[ 
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ].map((m) => (
          <TouchableOpacity
            key={m}
            style={styles.dropdownItem}
            onPress={() => {
            setMonth(m);
            setMonthOpen(false);
            const valid = isValidDate(day, m, year);
            if (errors.dob && valid) {
            setErrors((prev) => ({ ...prev, dob: null }));
  }
}}
          >
            <Text style={styles.dropdownItemText}>{m}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )}
</View>


  {/* yyyy */}
  <TextInput
    style={[styles.input, styles.yyBox]}
    placeholder="YYYY"
    keyboardType="numeric"
    maxLength={4}
    value={year}
onChangeText={(text) => {
  setYear(text);

  const valid = isValidDate(day, month, text);
  if (errors.dob && valid) {
    setErrors((prev) => ({ ...prev, dob: null }));
  }
}}

  />
</View>
{errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}



{/* gender */}
<View
  style={{ marginBottom: 12, position: "relative" }}
  onLayout={(event) => {
    const { y } = event.nativeEvent.layout;

    // if gender box is too low, dropdown opens upward
    if (y > 500) {
      setGenderOpenUpwards(true);
    } else {
      setGenderOpenUpwards(false);
    }
  }}
>

  <Text style={styles.label}>Gender</Text>


  {/* box */}
  <TouchableOpacity
    style={styles.dropdownContainer}
    onPress={() => setGenderOpen(!genderOpen)}
    activeOpacity={0.7}
  >
    <View style={styles.dropdownHeader}>
      <Text style={styles.dropdownLabel}>{gender || "Select Gender"}</Text>
      <Ionicons
        name={genderOpen ? "chevron-up" : "chevron-down"}
        size={20}
        color="#777"
      />
    </View>
  </TouchableOpacity>

  {/* dropdownlist */}
  {genderOpen && (
    <View
      style={[
        styles.dropdownList,
        genderOpenUpwards
          ? { bottom: 55, top: "auto" }
          : { top: 55 } // opens downward normally
      ]}
    >
      <ScrollView nestedScrollEnabled>
        {["Male", "Female", "Other"].map((g) => (
          <TouchableOpacity
            key={g}
            style={styles.dropdownItem}
            onPress={() => {
           setGender(g);
          setGenderOpen(false);

  if (errors.gender) {
    setErrors((prev) => ({ ...prev, gender: null }));
  }
}}

          >
            <Text style={styles.dropdownItemText}>{g}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )}

</View>

{errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
    </ScrollView>
          {/* SAVE  */}
  <View style={styles.fixedButtonContainer}>
    <TouchableOpacity
  onPress={() => {
    const newErrors = validate({
      firstName,
      lastName,
      phone,
      email,
      day,
      month,
      year,
      gender,
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return; 
    onSave();
  }}
  activeOpacity={0.9}
>
      <LinearGradient
        colors={["#FF6549", "#FFBF33"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.fixedButton}
      >
        <Text style={styles.buttonText}>Save Changes</Text>
      </LinearGradient>
    </TouchableOpacity>
  </View>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: { // labels above inputs
    fontSize: 15,
    marginTop: 8,
    marginBottom: 4,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#ffffffff",
    padding: 12,
    borderRadius: 20,
    fontSize: 16,
    borderColor:"#dfd9d9ff",
    borderWidth:1.5
  },

inputBox: { // icon + input inline
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#fff",
  borderRadius: 20,
  borderWidth: 1.5,
  borderColor: "#dfd9d9ff",
  paddingHorizontal: 10,
  paddingVertical: 0,   
  marginBottom: 8,
},


iconInside: {
  marginRight: 10,
},

inputInside: {
  flex: 1,
  fontSize: 16,
},

dobRow: { // space between DD, MM, YYYY
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
  columnGap: 12,
},

ddBox: {
  flex: 0.5,        
  borderRadius: 20,
  borderWidth: 1.5,
  borderColor: "#dfd9d9ff",
  backgroundColor: "#fff",
  paddingHorizontal: 12,
  paddingVertical: 10,
  fontSize: 16,
},

mmBox: {
  flex: 1.5,       
  borderRadius: 20,
  borderWidth: 1.5,
  borderColor: "#dfd9d9ff",
  backgroundColor: "#fff",
  paddingHorizontal: 12,
  justifyContent: "center",
  height: 48,
},

yyBox: {
  flex: 0.7,         
  borderRadius: 20,
  borderWidth: 1.5,
  borderColor: "#dfd9d9ff",
  backgroundColor: "#fff",
  paddingHorizontal: 12,
  paddingVertical: 10,
  fontSize: 16,
},

  dob: {
    flex: 1,
  },
  button: {
    padding: 15,
    borderRadius: 15,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },

photoSection: {
  alignItems: "center",
  marginBottom: 50,
  marginTop: 25,

},

avatarWrapper: {
  width: 110,       
  height: 110,
  borderRadius: 55,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#FFE6E6",
  position: "relative",
},

solidAvatar: {
  width: 90,        
  height: 90,
  borderRadius: 45,
  backgroundColor: "#FF8A8A",
  alignItems: "center",
  justifyContent: "center",
},

avatarInitials: {
  fontSize: 36,     
  fontWeight: "bold",
  color: "#fff",
},

statusDot: {
  width: 25,        
  height: 25,
  borderRadius: 12.5,
  backgroundColor: "#30D158",
  borderWidth: 2.5,
  borderColor: "#fff",
  position: "absolute",
  bottom: 8,        
  right: 10,
},

changePhotoButton: {
  marginTop: 15,
  paddingVertical: 8,
  paddingHorizontal: 22,
  borderWidth: 1.4,
  borderColor: "#FF5F6D",
  borderRadius: 22,
},

changePhotoText: {
  color: "#FF5F6D",
  fontWeight: "600",
  fontSize: 16,
},

fixedButtonContainer: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  padding: 20,
  backgroundColor: "#F6F6F6",
},
profileImage: {
  width: 90,
  height: 90,
  borderRadius: 45,
},
monthWrapper: {
  flex: 1.5,
  position: "relative",   
},
monthDropdownList: {
  position: "absolute",
  top: 55,               
  left: 0,
  right: 0,
  backgroundColor: "#fff",
  borderRadius: 17,
  borderWidth: 1.5,
  borderColor: "#dfd9d9ff",
  maxHeight: 180,
  zIndex: 9999,          
  elevation: 5,
  overflow: "hidden",
},


fixedButton: {
  padding: 15,
  borderRadius: 15,
  alignItems: "center",
},
dropdownContainer: {
  backgroundColor: "#fff",
  borderRadius: 17,
  borderWidth: 1.5,
  borderColor: "#dfd9d9ff",
  paddingHorizontal: 12,
  height: 48,
  justifyContent: "center",
},

dropdownHeader: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
},

dropdownLabel: {
  fontSize: 16,
  color: "#555",
},

dropdownList: {
  marginTop: 5,
  backgroundColor: "#fff",
  borderRadius: 17,
  borderWidth: 1.5,
  borderColor: "#dfd9d9ff",
  overflow: "hidden",
  elevation: 3,
  width: "100%",        
  maxHeight: 200,       
  alignSelf: "center",
},

dropdownItem: {
  paddingVertical: 12,
  paddingHorizontal: 15,
},

dropdownItemText: {
  fontSize: 16,
  color: "#000",
},
errorText: {
  color: "red",
  fontSize: 17,
  marginTop: 2,
  marginBottom: 6,
},


});
