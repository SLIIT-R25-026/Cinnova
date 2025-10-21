import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const features = [
    {
      id: 1,
      title: 'CinnovaScan',
      icon: require('../assets/icons/CinnovaScan.png'),
      onPress: () => navigation.navigate('CinnovaScanHome'),
    },
    {
      id: 2,
      title: 'CinnovaCare',
      icon: require('../assets/icons/CinnovaCare.png'),
      onPress: () => navigation.navigate('CinnovaCare'),
    },
    {
      id: 3,
      title: 'CinnovaGrow',
      icon: require('../assets/icons/CinnovaGrow.png'),
      onPress: () => navigation.navigate('CinnovaGrow'),
    },
    {
      id: 4,
      title: 'CinnovaGrade',
      icon: require('../assets/icons/CinnovaGrade.png'),
      onPress: () => navigation.navigate('CinnovaGrade'),
    }  
  ];

  return (
    <View className="flex-1" style={{ backgroundColor: '#6B4423' }}>

      {/* Top Curved Circle Section */}
      <View className="relative z-10">
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: -width * 0.3,
            width: width * 1.4,
            height: height * 0.5,
            backgroundColor: '#FBF9F4',
            borderTopLeftRadius: width * 0.5,
            borderTopRightRadius: width * 0.1,
            borderBottomLeftRadius: width * 0.7,
            borderBottomRightRadius: width * 1.2,
          }}
        />

        {/* Logo + Welcome */}
        <View style={{ marginTop: height * 0.07, paddingHorizontal: width * 0.05 }}>
          <Image
            source={require('../assets/logo/cinnova_logo.png')}
            style={{
              width: width * 0.45,
              height: width * 0.45,
              marginBottom: height * 0.01,
            }}
            resizeMode="contain"
          />

          <Text
            style={{
              fontSize: width * 0.07,
              fontWeight: 'bold',
              color: '#6B4423',
            }}
          >
            Welcome to Cinnova
          </Text>

          <Text
            style={{
              fontSize: width * 0.04,
              lineHeight: width * 0.05,
              marginTop: height * 0.005,
              color: '#6B4423',
            }}
          >
            Smarter care for your{'\n'}cinnamon trees, powered by AI
          </Text>
        </View>
      </View>

      {/* Bottom Brown Section */}
      <View
        style={{
          flex: 1,
          backgroundColor: '#6B4423',
          marginTop: height * 0.18,
          paddingHorizontal: width * 0.05,
        }}
        className="z-10"
      >
        {/* Make cards scrollable */}
        <ScrollView
          contentContainerStyle={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            paddingBottom: height * 0.1,
          }}
          showsVerticalScrollIndicator={false}
        >
          {features.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={{
                backgroundColor: '#fff',
                borderRadius: 20,
                padding: width * 0.04,
                marginBottom: height * 0.02,
                alignItems: 'center',
                width: (width - width * 0.2) / 2, // keeps 2 per row
              }}
              activeOpacity={0.8}
              onPress={feature.onPress}
            >
              <View
                style={{
                  width: width * 0.15,
                  height: width * 0.15,
                  backgroundColor: '#f3f3f3',
                  borderRadius: width * 0.04,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: height * 0.01,
                }}
              >
                <Image
                  source={feature.icon}
                  style={{ width: '80%', height: '80%' }}
                  resizeMode="contain"
                />
              </View>

              <Text style={{ fontWeight: 'bold', fontSize: width * 0.035, textAlign: 'center' }}>
                {feature.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Decorative leaf */}
        <Image
          source={require('../assets/icons/bottem_leaf_icon.png')}
          className="absolute opacity-30 z-0"
          style={{ bottom: 0, right: 0, zIndex: -1 }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}
