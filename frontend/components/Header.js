import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; 

const Header = ({ title }) => {
  const navigation = useNavigation();
  
  return (
    <View 
      className="p-4 flex-row items-center justify-between" 
      style={{ backgroundColor: '#FBF9F4' }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={30} color="#6B4423" />
      </TouchableOpacity>
      
      <Text 
        className="text-2xl font-bold" 
        style={{ color: '#6B4423' }}
      >
        {title}
      </Text>

      {/* Empty placeholder to keep title centered */}
      <View style={{ width: 30 }} />
    </View>
  );
};

export default Header;
