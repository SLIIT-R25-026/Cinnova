import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  FlatList,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Header from "../components/Header";

// Disease descriptions
const diseaseInfo = {
  Healthy: {
    title: "Healthy",
    scientific_name: "Cinnamomum verum",
    description:
      "The cinnamon bark is healthy, showing no signs of disease or damage. Healthy bark ensures optimal growth and quality of the cinnamon crop.",
    suggestion:
      "Maintain good care, ensure proper irrigation and nutrition, and monitor regularly for any early signs of disease.",
    color: "#4CAF50",
    icon: "check-circle",
  },
  HumanCut: {
    title: "Human Cut",
    scientific_name: "",
    description:
      "The bark shows signs of human cuts or mechanical damage. Such damage may affect bark quality and make the tree susceptible to infections.",
    suggestion:
      "Avoid mechanical injuries and handle bark carefully to prevent damage.",
    color: "#607D8B",
    icon: "content-cut",
  },
  RoughBark: {
    title: "Rough Bark",
    scientific_name: "Fusarium spp.",
    description:
      "Rough bark disease, a fungal disease, is a significant problem in cinnamon cultivation, particularly in Sri Lanka, causing reduced peelability and affecting the quality of the bark.",
    suggestion: "Check for fungal infections and prune affected areas.",
    color: "#FFC107",
    icon: "warning",
  },
  StripeCanker: {
    title: "Stripe Canker",
    scientific_name: "Cylindrocladium sp.",
    description:
      "Stripe canker is a fungal disease that affects cinnamon trees, causing sunken lesions along the bark. It can reduce bark quality, limit growth, and make the tree more susceptible to secondary infections.",
    suggestion:
      "Apply recommended fungicide and remove severely affected bark to prevent further spread of the disease.",
    color: "#F44336",
    icon: "dangerous",
  },
};

export default function CinnovaScanResultScreen() {
  const [groupedResults, setGroupedResults] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const screenWidth = Dimensions.get("window").width;
  const spacing = 5;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const jsonResults = await AsyncStorage.getItem("cinnova_results");
        const parsedResults = jsonResults ? JSON.parse(jsonResults) : [];

        // Group results by predicted label
        const grouped = parsedResults.reduce((acc, item) => {
          if (!item || !item.predicted_label) return acc;
          if (!acc[item.predicted_label]) acc[item.predicted_label] = [];
          acc[item.predicted_label].push(item);
          return acc;
        }, {});

        // Map grouped results to array
        const groupedArray = Object.keys(grouped).map((label) => {
          const items = grouped[label];
          return {
            label,
            images: items.map((i) => i.localImage || i.image), // Use local image URL if available
          };
        });

        setGroupedResults(groupedArray);
      } catch (error) {
        console.error("Failed to load scan results:", error);
        setGroupedResults([]);
      }
    };

    fetchResults();
  }, []);

  const openImage = (img) => {
    setSelectedImage(img);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => {
    const info = diseaseInfo[item.label] || {
      title: item.label,
      scientific_name: "",
      description: "No information available",
      suggestion: "",
      color: "#999",
      icon: "help",
    };

    return (
      <View className="m-4">
        {/* Disease card */}
        <View
          className="rounded-xl shadow-lg p-4 bg-[#F7F4EA]"
          style={{ borderLeftWidth: 5, borderLeftColor: info.color }}
        >
          {/* Image gallery */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            className="mb-3"
          >
            {item.images.map((img, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => openImage(img)}
                activeOpacity={0.8}
                style={{ marginRight: spacing }}
              >
                <Image
                  source={{ uri: img }} // Use local image URL
                  style={{
                    width: screenWidth / 3,
                    height: screenWidth / 3,
                    borderRadius: 8,
                  }}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Disease info */}
          <View className="flex items-start p-4 rounded-lg bg-white shadow-md">
            <View className="flex-row items-center mb-2">
              {info.icon && (
                <MaterialIcons name={info.icon} size={24} color={info.color} />
              )}
              <Text
                className="text-lg font-bold ml-2"
                style={{ color: "#6B4423" }}
              >
                {info.title}
              </Text>
            </View>

            {info.scientific_name && item.label !== "Healthy" && (
              <Text className="text-sm font-semibold italic text-[#725844] mb-1">
                {info.scientific_name}
              </Text>
            )}

            <Text
              className="text-sm text-justify mb-1"
              style={{ color: "#6B4423" }}
            >
              {info.description}
            </Text>

            {info.suggestion && item.label !== "Healthy" && (
              <Text
                className="text-sm font-medium text-justify mt-1"
                style={{ color: "#6B4423" }}
              >
                {info.suggestion}
              </Text>
            )}

            {/* Confidence hidden */}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#6B4423] relative">
      {/* Header */}
      <View className="shadow-3xl border-b border-gray-100 px-4 pt-4 bg-[#FBF9F4] z-10">
        <Header title="CinnovaScan Results" />
      </View>

      {/* Empty State */}
      {groupedResults.length === 0 ? (
        <View className="flex-1 items-center justify-center px-4 z-10">
          <Image
            source={require("../assets/icons/empty-folder.png")}
            style={{ width: 150, height: 150, marginBottom: 20 }}
          />
          <Text className="text-white text-lg font-medium text-center">
            No scan results available. {"\n"} Start a new scan to see insights!
          </Text>
        </View>
      ) : (
        <FlatList
          data={groupedResults}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 50 }}
          className="z-10"
        />
      )}

      {/* Fullscreen Image Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View className="flex-1 bg-black bg-opacity-90 justify-center items-center">
          <TouchableOpacity
            className="absolute top-10 right-10"
            onPress={() => setModalVisible(false)}
          >
            <Text className="text-white text-xl font-bold">Close</Text>
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={{
                width: screenWidth - 40,
                height: screenWidth - 40,
                borderRadius: 12,
              }}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>

      {/* Decorative leaf background */}
      <Image
        source={require("../assets/icons/bottem_leaf_icon.png")}
        className="absolute bottom-0 right-0 opacity-20 z-0"
        resizeMode="cover"
      />
    </SafeAreaView>
  );
}
