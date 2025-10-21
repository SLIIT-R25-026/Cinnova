import React, { useState } from 'react';
import { 
  View, Text, SafeAreaView, Image, TouchableOpacity, 
  FlatList, Alert, Dimensions 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import FullScreenLoader from '../components/FullScreenLoader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import configUrl from '../util/config_url';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


// Responsive image sizing
const screenWidth = Dimensions.get('window').width;
const numColumns = 2;
const spacing = 16;
const imageSize = (screenWidth - (numColumns + 1) * spacing) / numColumns;

export default function CinnovaScanScreen({ navigation }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Camera roll permission is needed to select images.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1
    });

    if (!result.canceled) {
      const selected = result.assets.map(a => a.uri);
      if (images.length + selected.length > 5) {
        Alert.alert("Limit Reached", "You can select up to 5 images.");
        return;
      }
      setImages([...images, ...selected]);
    }
  };

  const removeImage = (uri) => setImages(images.filter(img => img !== uri));

  const handleScan = async () => {
    if (images.length === 0) return;
    setLoading(true);

    try {
      let uploadedPaths = [];

      // Upload images
      for (let img of images) {
        let formData = new FormData();
        formData.append("file", {
          uri: img,
          name: `image_${Date.now()}.jpg`,
          type: "image/jpeg"
        });
        formData.append("folder", "CinnovaScan");

        let res = await fetch(`${configUrl.fileupload}/cinnova/upload.php`, {
          method: "POST",
          body: formData,
          headers: { "Content-Type": "multipart/form-data" }
        });

        const json = await res.json();
        console.log('Image Upload response:', json);
        uploadedPaths.push(json.file_path);
      }

      // Analyze uploaded images
      let results = [];
      for (let i = 0; i < uploadedPaths.length; i++) {
        const path = uploadedPaths[i];
        const localUri = images[i];
        console.log('IP:', configUrl.mlbackend);

        const apiRes = await fetch(`${configUrl.mlbackend}/check_bark`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image_path: path })
        });
        const apiJson = await apiRes.json();
        console.log('ML API response (Scan):', apiJson);
        
        if (apiJson.error || apiJson.Error || apiJson.message) {
          const errorMessage = apiJson.error || apiJson.Error || apiJson.message || 'Unknown error';
          Alert.alert(
            "Scan Error", 
            `One or more images could not be processed:\n\n${errorMessage}\n\nPlease try again with different images.`,
            [{ text: "OK" }]
          );
          setLoading(false);
          return;
        }

        if (apiJson.confidence && apiJson.confidence < 0.65) {
          const formattedConfidence = Math.round(apiJson.confidence * 100);

          Alert.alert(
            "Scan Error",
            `One or more images could not be processed clearly. \n\nPlease try using higher quality images with better lighting or focus for more accurate results. \n\n E0${formattedConfidence}`,
            [{ text: "OK" }]
          );
          
          setLoading(false);
          return;
        }

        // Include both server and local image URIs
        results.push({ 
          image: path,         
          localImage: localUri,
          ...apiJson
        });
      }

      console.log('Scan results:', results);

      if (results.length === 0) {
        Alert.alert("Error", "No image/s could be processed successfully. Please try again with clearer images.");
        setLoading(false);
        return;
      }

      // Save and navigate
      await AsyncStorage.setItem("cinnova_results", JSON.stringify(results));
      navigation.navigate("CinnovaScanResults", { results });

    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message || "Something went wrong while scanning.");
    }

    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#6B4423] relative">

      {/* Header */}
      <View className="shadow-3xl border-b border-gray-100 px-4 pt-4 bg-[#FBF9F4] z-10">
        <Header title="CinnovaScan" />
      </View>

      {/* Content container */}
      <View className="flex-1 z-10">
        {/* Top Card */}
        <View className="mx-4 mt-4 mb-2 p-4 rounded-xl flex-row items-center bg-[#FBF9F4]">
          <Image 
            source={require('../assets/icons/CinnovaScan.png')}
            className="w-15 h-15 rounded-lg mr-3"
          />
          <View className="w-[2px] h-12 bg-[#6B4423] mr-3" />
          <Text className="flex-1 text-base font-medium text-[#6B4423] leading-5">
            Detects early signs of Cinnamon Bark Disease for timely action.
          </Text>
        </View>

        {/* Select Images Button */}
        <TouchableOpacity 
          className="mx-4 my-2 py-3 rounded-lg flex-row items-center justify-center bg-[#588E26]"
          onPress={pickImages}
        >
          <Icon name="photo-library" size={24} color="white" className="mr-2" />
          <Text className="text-white text-lg font-medium">Select Images</Text>
        </TouchableOpacity>

        {/* Image Grid or No Images */}
        {images.length === 0 ? (
          <View className="mx-4 my-2 p-6 rounded-xl items-center justify-center bg-[#FBF9F4]">
            <Image 
              source={require('../assets/icons/no-photo.png')}
              className="w-20 h-20 mb-4"
              resizeMode="contain"
            />
            <Text className="text-[#6B4423] text-center text-base font-medium">
              No images selected. {"\n"} Please select up to 5 cinnamon bark images to begin scan.
            </Text>
          </View>
        ) : (
          <FlatList
            data={images}
            keyExtractor={(item, index) => index.toString()}
            numColumns={numColumns}
            contentContainerStyle={{ padding: spacing / 2 }}
            renderItem={({ item }) => (
              <TouchableOpacity activeOpacity={0.8} onPress={() => removeImage(item)}>
                <View className="m-2 rounded-xl overflow-hidden shadow-lg relative">
                  <Image source={{ uri: item }} style={{ width: imageSize, height: imageSize }} />
                  <View className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full px-2 py-1">
                    <Text className="text-white font-bold">X</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Scan Button */}
        {images.length > 0 && (
          <TouchableOpacity 
            className="mx-4 my-3 py-3 rounded-lg flex-row items-center justify-center bg-[#588E26]"
            onPress={handleScan}
            style={{ marginBottom: insets.bottom + 8 }}
          >
            <Icon name="search" size={24} color="white" className="mr-2" />
            <Text className="text-white text-lg font-medium">Scan</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Decorative leaf background */}
      <Image
        source={require('../assets/icons/bottem_leaf_icon.png')}
        className="absolute bottom-0 right-0  opacity-20 z-0"
        resizeMode="cover"
      />

      {/* Full screen loader */}
      {loading && <FullScreenLoader message="Analyzing your images... 🌿" />}
    </SafeAreaView>
  );
}
