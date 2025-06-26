import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MapPin,
  Navigation,
  Star,
  Clock,
  Phone,
  Filter,
  Search,
} from 'lucide-react-native';
import { mockFoodItems } from '@/data/mockData';
import { FoodItem } from '@/types';

const { width, height } = Dimensions.get('window');

export default function DiscoverScreen() {
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 40.7128,
    longitude: -74.0060,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  // Mock map markers
  const markers = mockFoodItems.map(item => ({
    id: item.id,
    coordinate: {
      latitude: item.location.latitude,
      longitude: item.location.longitude,
    },
    item,
  }));

  const handleMarkerPress = (item: FoodItem) => {
    setSelectedItem(item);
  };

  const handleNavigate = (item: FoodItem) => {
    const address = encodeURIComponent(item.location.address);
    const url = Platform.select({
      ios: `maps://app?daddr=${address}`,
      android: `google.navigation:q=${address}`,
      web: `https://www.google.com/maps/dir/?api=1&destination=${address}`,
    });

    if (url) {
      if (Platform.OS === 'web') {
        window.open(url, '_blank');
      } else {
        Linking.canOpenURL(url).then((supported) => {
          if (supported) {
            Linking.openURL(url);
          } else {
            const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
            Linking.openURL(webUrl);
          }
        });
      }
    }
  };

  const handleCall = (item: FoodItem) => {
    const phoneNumber = '+1234567890';
    
    if (Platform.OS === 'web') {
      window.open(`tel:${phoneNumber}`);
    } else {
      const url = `tel:${phoneNumber}`;
      Linking.canOpenURL(url).then((supported) => {
        if (supported) {
          Linking.openURL(url);
        }
      });
    }
  };

  const MapView = () => (
    <View style={styles.mapContainer}>
      <View style={styles.mapPlaceholder}>
        <MapPin size={48} color="#FF6B35" />
        <Text style={styles.mapText}>Interactive Map</Text>
        <Text style={styles.mapSubtext}>
          Map integration would show food locations around you
        </Text>
      </View>
      
      {/* Mock markers */}
      <View style={styles.markersContainer}>
        {markers.slice(0, 3).map((marker, index) => (
          <TouchableOpacity
            key={marker.id}
            style={[
              styles.marker,
              {
                top: 100 + (index * 80),
                left: 50 + (index * 100),
              }
            ]}
            onPress={() => handleMarkerPress(marker.item)}
          >
            <View style={styles.markerContent}>
              <Text style={styles.markerPrice}>
                ${marker.item.price.min}+
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const LocationCard = ({ item }: { item: FoodItem }) => (
    <View style={styles.locationCard}>
      <View style={styles.cardHeader}>
        <Image source={{ uri: item.media.thumbnail }} style={styles.cardImage} />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.cardVendor}>{item.vendor.name}</Text>
          <View style={styles.cardDetails}>
            <View style={styles.rating}>
              <Star size={14} color="#FFD700" fill="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
            <View style={styles.timeDistance}>
              <Clock size={14} color="#8E8E93" />
              <Text style={styles.timeText}>{item.preparationTime}min</Text>
              <Text style={styles.separator}>•</Text>
              <MapPin size={14} color="#8E8E93" />
              <Text style={styles.distanceText}>{item.location.distance.toFixed(1)}km</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={styles.callButton}
          onPress={() => handleCall(item)}
        >
          <Phone size={16} color="#FF6B35" />
          <Text style={styles.callText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navigateButton} 
          onPress={() => handleNavigate(item)}
        >
          <Navigation size={16} color="#FFFFFF" />
          <Text style={styles.navigateText}>Navigate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Discover</Text>
          <Text style={styles.headerSubtitle}>Find food around you</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Search size={20} color="#FF6B35" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Filter size={20} color="#FF6B35" />
          </TouchableOpacity>
        </View>
      </View>

      <MapView />

      {selectedItem ? (
        <View style={styles.bottomSheet}>
          <LocationCard item={selectedItem} />
        </View>
      ) : (
        <ScrollView style={styles.nearbyContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.nearbyTitle}>Nearby Food Spots</Text>
          {mockFoodItems.slice(0, 4).map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setSelectedItem(item)}
              style={styles.nearbyItem}
            >
              <Image source={{ uri: item.media.thumbnail }} style={styles.nearbyImage} />
              <View style={styles.nearbyInfo}>
                <Text style={styles.nearbyName}>{item.title}</Text>
                <Text style={styles.nearbyVendor}>{item.vendor.name}</Text>
                <View style={styles.nearbyDetails}>
                  <Star size={12} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.nearbyRating}>{item.rating}</Text>
                  <Text style={styles.nearbySeparator}>•</Text>
                  <MapPin size={12} color="#8E8E93" />
                  <Text style={styles.nearbyDistance}>{item.location.distance.toFixed(1)}km</Text>
                </View>
              </View>
              <Text style={styles.nearbyPrice}>
                ${item.price.min}-{item.price.max}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    height: height * 0.4,
    backgroundColor: '#E8F4F8',
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mapText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FF6B35',
    marginTop: 12,
  },
  mapSubtext: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
  },
  markersContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  marker: {
    position: 'absolute',
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerContent: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  markerPrice: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  cardVendor: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#FF6B35',
    marginBottom: 8,
  },
  cardDetails: {
    gap: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    marginLeft: 4,
  },
  timeDistance: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#8E8E93',
    marginLeft: 4,
  },
  separator: {
    fontSize: 12,
    color: '#8E8E93',
    marginHorizontal: 8,
  },
  distanceText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#8E8E93',
    marginLeft: 4,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  callText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FF6B35',
    marginLeft: 8,
  },
  navigateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FF6B35',
  },
  navigateText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  nearbyContainer: {
    flex: 1,
    padding: 20,
  },
  nearbyTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  nearbyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  nearbyImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  nearbyInfo: {
    flex: 1,
  },
  nearbyName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  nearbyVendor: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#FF6B35',
    marginBottom: 4,
  },
  nearbyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nearbyRating: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    marginLeft: 4,
  },
  nearbySeparator: {
    fontSize: 12,
    color: '#8E8E93',
    marginHorizontal: 6,
  },
  nearbyDistance: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#8E8E93',
    marginLeft: 4,
  },
  nearbyPrice: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
  },
});