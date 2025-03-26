import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions, FlatList, Easing, Image } from 'react-native';
import CustomHeader from "../Components/CustomHeader";
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import VerticalLine from './VerticalLine';
import SearchFields from './SearchFeilds'; // Import your SearchFields component

const SearchResultsScreen = ({ navigation, route }) => {
  const { searchResults, from, to, date } = route.params;
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showSearchFields, setShowSearchFields] = useState(false); // Add this state

  // console.log(searchResults);

  //animation Part
  const detailViewHeight = Dimensions.get('screen').height * 0.88;
  const detailViewAnim = useRef(new Animated.Value(Dimensions.get('screen').height)).current;
  const searchFieldsAnim = useRef(new Animated.Value(0)).current; // Add this for animation

  //overlay
  const Overlay = ({ onPress }) => (
    <TouchableOpacity style={styles.overlay} onPress={onPress}>
      <View style={styles.overlayBackground} />
    </TouchableOpacity>
  );



  const clearSelectedRoute = () => {
    setSelectedRoute(null);
  };

  function formatTimeFromISO(isoString) {
    const date = new Date(isoString); // Directly create Date object

    if (isNaN(date.getTime())) { // Check for invalid date
      console.error("Invalid ISO date string:", isoString);
      return "Invalid Time";
    }

    let formattedTime = new Intl.DateTimeFormat('en-IN', { // Chennai, Tamil Nadu locale
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);

    formattedTime = formattedTime.replace("am", "AM").replace("pm", "PM");
    return formattedTime;
  }

  useEffect(() => {
    navigation.setOptions({
      header: () => {
        return (
          <CustomHeader
            navigation={navigation}
            from={from}
            to={to}
            date={date}
            setShowSearchInput={setShowSearchFields} // Pass the state updater function
          />
        );
      },
    });
  }, [navigation, from, to, date]);

  useEffect(() => {
    if (selectedRoute) {
      Animated.timing(detailViewAnim, {
        toValue: Dimensions.get('window').height - detailViewHeight,
        duration: 500,
        easing: Easing.in(Easing.linear),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(detailViewAnim, {
        toValue: Dimensions.get('window').height,
        duration: 300,
        easing: Easing.in(Easing.linear),
        useNativeDriver: true,
      }).start();
    }
  }, [selectedRoute]);

  // Toggle animation
  useEffect(() => {
    Animated.timing(searchFieldsAnim, {
      toValue: showSearchFields ? 1 : 0, // 1 for open, 0 for closed
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showSearchFields]);

  const RouteDetailedView = ({ route }) => {
    // console.log(route);

    const amenityIcons = {
      'ChargingPort': 'cellphone-charging',
      'Wifi': 'wifi',
      'WaterBottle': 'bottle-soda-classic',
      'AC': 'air-filter',
      'TV': 'television',
      'ReadingLight': 'lightbulb-on',
      'Blankets': 'alert-circle'
    };

    const renderBusType = () => {

      if (!route.busType) {
        return null;
      }
      const BusTypeList = route.busType.map((item: string) => item.trim());
      return (
        <View style={styles.AmeniContainer1}>
          <Text style={styles.AmeniTitle}>Bus Types </Text>
          <View style={styles.BustypeContainer}>
            {BusTypeList.map((busTypes, index) => {
              return (
                <View key={index} style={styles.BusItem}>
                  <Text style={styles.BusText}>{busTypes}</Text>
                </View>
              );
            })}
          </View>
        </View>
      );
    }
    // Function to render amenities with icons
    const renderAmenities = () => {
      // console.log(route.amenities)
      if (!route.amenities || route.amenities.length === 0) {
        return null;
      }
      const amenitiesList = route.amenities.map((item: string) => item.trim());
      return (
        <View style={styles.AmeniContainer2}>
          <Text style={styles.AmeniTitle}>Amenities</Text>
          <View style={styles.amenitiesContainer}>
            {amenitiesList.map((amenity, index) => {
              const iconName = amenityIcons[amenity] || 'checkbox-blank-outline';
              return (
                <View key={index} style={styles.amenityItem}>
                  <Icons name={iconName} size={16} color="#000" style={styles.icon} />
                  <Text style={styles.AmeniText}>{amenity}</Text>
                </View>
              );
            })}
          </View>
        </View>
      );
    };


    return (
      <Animated.ScrollView showsVerticalScrollIndicator={false}
        style={{ flexGrow: 1 }} // Add flexGrow: 1 here
        contentContainerStyle={{ paddingBottom: 80 }}>

        <View style={styles.detailedViewContent}>
          <View style={styles.routeDetails}>
            <View style={styles.routeHeader}>
              <View>
                <Text style={styles.routeTitle}>{selectedRoute.busName}</Text>
                <Text style={styles.routeType}>
                  {selectedRoute.busNumber}{" | "}{selectedRoute.busType.join(", ")}
                </Text>
              </View>

              <View style={styles.ratingContainer}>
                <View style={styles.rating}>
                  <Icon name="star" size={12} color="white" style={styles.starIcon} />
                  <Text style={styles.ratingText}>4.5 </Text>
                </View>
                <View style={styles.ratingCount}>
                  <Icon name="person" size={12} color="black" style={styles.userIcon} />
                  <Text style={styles.ratingCountText}>10 </Text>
                </View>
              </View>

            </View>
            <View>
              {renderBusType()}
            </View>
            <View>
              {selectedRoute.amenities && selectedRoute.amenities.length > 0 ? (renderAmenities()) : null}
            </View>

            {selectedRoute.busRoute && selectedRoute.busRoute.length > 0 && (
              <View style={styles.progress}>
                <View style={styles.progressItems}>
                  {/* BUS ORIGIN */}
                  <View style={styles.progressItem}>
                    <View style={styles.totalorgin}>
                      <Text style={styles.location}>BUS ORIGIN</Text>
                      <Text style={[styles.locationName,]}>
                        {selectedRoute.busRoute[0].from.cityName}
                      </Text>
                      <Text style={styles.time}>{formatTimeFromISO(selectedRoute.busRoute[0].from.departureTime)}</Text>
                    </View>
                  </View>
                  <View style={styles.swap}>
                    <Icons name="swap-horizontal-circle" size={25} color="#fff" style={styles.iconsAme} />
                  </View>
                  {/* BUS END */}
                  <View style={[styles.progressItem, styles.boarding]}>
                    <View style={styles.totalorgin}>
                      <Text style={[styles.location, styles.boardingLocation]}>DESTINATION</Text>
                      <Text style={[styles.locationName, styles.boardingLocationName]}>
                        {selectedRoute.busRoute[0].to.cityName}
                      </Text>
                      <Text style={styles.time}>{formatTimeFromISO(selectedRoute.busRoute[0].to.arrivalTime)}</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}


            {/* +3 Stops Section */}
            <View style={styles.trContainer}>
              <View>
                <Icon name="location" size={25} color="red" style={styles.iconsAme} />
              </View>
              <View style={styles.dottedLine} />
              <Text style={styles.stopsText}>+ {selectedRoute.busStops.length} Bus stops</Text>
              <View style={styles.dottedLine} />
              <View style={styles.busIconContainer}>
                <Image source={require('../Components/asset/bus.png')} style={styles.busIcon} />
              </View>
            </View>


            <View style={styles.stopContainer}>
              <View style={styles.stopItemContainer}>
                <Icon name="navigate-sharp" size={18} color="#000000" style={styles.iconfrto} />
                <View ><Text style={styles.locationindivator}>{selectedRoute.busRoute[0].from.cityName}</Text></View>
              </View>
              {/* Use map instead of FlatList */}
              {selectedRoute.busStops.map((stop, index) => (
                <View style={styles.stopItemContainer} key={index}>
                  <Icon name="radio-button-on-outline" size={21} color="#007bff" />
                  {index > 0 && <VerticalLine style={styles.verticalLine} />}
                  <Text style={styles.stopName}>{stop.name}</Text>
                </View>
              ))}

              <View style={styles.stopItemContainer}>
                <Icon name="location-sharp" size={18} color="#000000" style={styles.iconfrto} />
                <View><Text style={styles.locationindivator}>{selectedRoute.busRoute[0].to.cityName}</Text></View>
              </View>
            </View>
            {selectedRoute && (
              <TouchableOpacity
                style={styles.mapButton}
                onPress={() => {
                  navigation.navigate('Map', {
                    selectedRoute: {
                      ...selectedRoute,
                      busStops: selectedRoute.busStops.map((stop) => ({
                        name: stop.name,
                        latitude: stop.latitude,
                        longitude: stop.longitude,
                      })),
                    },
                  });
                }}
              >
                <Text style={styles.mapButtonText}>View Route on Map</Text>
              </TouchableOpacity>
            )}


          </View>
        </View>
      </Animated.ScrollView>
    );
  };
  // <View>
  //   {selectedRoute.busImageUri && (
  //     <View>
  //       <Image source={{ uri: selectedRoute.busImageUri }} style={styles.BusImage} />
  //     </View>
  //   )}
  // </View>

  if (!searchResults) {
    return (
      <View style={styles.container}>
        <Text>No search results found.</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View><CustomHeader
        navigation={navigation}
        from={from}
        to={to}
        date={date}
        setShowSearchInput={setShowSearchFields} // Pass the state updater function
      />
        <View>
          {showSearchFields && ( // Conditionally render SearchFields
            <Animated.View
              style={[
                styles.searchFeildsContainer,
                {
                  transform: [{ translateY: searchFieldsAnim }],
                },
              ]}
            >
              <SearchFields onSearch={() => setShowSearchFields(false)} />
            </Animated.View>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {searchResults.map((item) => (
          <View
            key={item._id}
            style={styles.routeItem}

          >
            <View style={styles.BusContainer}>
              <View>
                <Text style={styles.BusName}>{item.busName}</Text>
                <Text style={styles.BusNumber}>
                  {item.busNumber}{" | "} {item.busType.join(", ")}
                </Text>
              </View>
              <Text style={[styles.Busdiv, item.isGovernt ? styles.Busdiv2 : styles.Busdiv]}>
                {item.isGovernt ? 'Goverment ' : 'Private '}
              </Text>
            </View>
            {item.busRoute && item.busRoute.length > 0 && (
              <View style={styles.TimeInfo}>
                <Text style={styles.FromTo}>{item.busRoute[0].from.cityName}</Text>
                <View style={styles.ConnectingLine} />
                <View style={styles.distanceContainer}>
                  <Text style={styles.distance}><Icon name="arrow-forward-outline" size={20} color="#fff" style={styles.icons} /></Text>
                </View>
                <View style={styles.ConnectingLine} />
                <Text style={styles.FromTo}>{item.busRoute[0].to.cityName}</Text>
                {/* <Text style={styles.hours}>08h.30m</Text> */}
              </View>
            )}

            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Icons name="seat-recline-extra" size={16} color="red" style={styles.icon} />

                <Text style={styles.infoText}>Seats </Text>
              </View>
              <View style={styles.infoItem}>
                <Icons name="navigation-variant" size={16} color="green" style={styles.icon} />
                <Text style={styles.infoText}>Trackable </Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="radio-outline" size={16} color="blue" style={styles.icon} />
                <Text style={styles.infoText}>1 Amenity </Text>
              </View>
            </View>

            <View style={styles.bottomLieInFlat}>
              <View style={styles.bottomlie}>
                <Icon
                  name='chevron-down'
                  size={20}
                  color="#fff"
                />
                <Text style={styles.BusDetails} onPress={() => { setSelectedRoute(item); }}>View Bus Details </Text>
              </View>
            </View>

          </View>
        ))}
      </ScrollView>
      {selectedRoute && (
        <>
          <Overlay onPress={clearSelectedRoute} />
          <Animated.View
            style={[
              styles.detailView,
              {
                transform: [{ translateY: detailViewAnim }],
                height: detailViewHeight,
              },
            ]}
          >
            <RouteDetailedView route={selectedRoute} />
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  searchFeildsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    zIndex: 10,
  },
  routeItem: {
    marginTop: 10,
    padding: 15,
    backgroundColor: 'rgba(34, 107, 63, 0.5)',
    marginBottom: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'teal',
    // elevation: 10,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
  },
  BusImage: {
    width: 200,
    height: 200,
  },
  BusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  routeName: {
    fontSize: 10,
    fontWeight: "bold",
  },
  BusName: {
    textTransform: 'uppercase',
    fontStyle: 'italic',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1
  },
  BusNumber: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 12,
    color: '#fff',
    width: 300,
    flexWrap: 'wrap'
    // backgroundColor: 'red'
  },
  Busdiv: {
    backgroundColor: '#143D60',//orenge
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: 'white',
    padding: 5,
    borderRadius: 40,
    fontSize: 12,
    width: 60,
    textAlign: 'center',
    right: 12,
    // borderWidth: 1,
    // borderColor: 'teal'
  },
  Busdiv2: {
    backgroundColor: 'teal',
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: 'white',
    padding: 5,
    borderRadius: 40,
    fontSize: 12,
  },
  TimeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    // backgroundColor: 'red'
  },
  FromTo: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 19,
    color: '#fff',
    borderWidth: .5,
    borderColor: '#fff',
    padding: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
    // backgroundColor: 'red',
    minWidth: 120,
    textAlign: 'center'
  },
  distanceContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fff',
  },
  distance: {
    // fontStyle: 'italic',
    // fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
    // fontSize: 16,
    // color: '#fff',
  },
  ConnectingLine: {
    height: 1,
    backgroundColor: '#fff',
    width: 20,
  },
  hours: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 14,
    color: 'black',
    marginLeft: 'auto',
    // backgroundColor: 'red'
  },
  bottomLieInFlat: {
    marginTop: 10,
    borderTopColor: '#fff',
    borderTopWidth: 2,
    // flexDirection: 'row',
    // backgroundColor: 'red',
    // alignItems: 'center',
  },
  bottomlie: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 120,
    padding: 2,
    // backgroundColor: 'blue',
    alignItems: 'center',
    left: 233

  },
  BusDetails: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#fff',
    // marginTop: 5,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: 'black',
    opacity: 0.5,
  },
  stopItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,

  },

  detailedViewContent: {

    flex: 1,
  },
  routeDetails: {
    backgroundColor: "white",
    padding: 5,
    position: "relative",
  },
  routeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingBottom: 20,
    borderBottomWidth: .5,
    borderBottomColor: 'grey',
  },
  routeTitle: {
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: "bold",
    marginBottom: 0,
  },
  routeType: {
    fontStyle: 'italic',
    fontSize: 12,
    color: 'grey',
    // backgroundColor: 'red'
  },
  BusType: {
    fontSize: 12,
    alignItems: "center",
    backgroundColor: "#e37400",
    textAlign: "center",
    padding: 4,
    color: "white",
    borderRadius: 3,
  },
  routeFromTo: {
    fontSize: 18,
    color: "grey",
    marginBottom: 10,
  },
  stopList: {
    left: 3,
    marginBottom: 0,
  },
  mapButton: {
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 20,
    marginTop: 15,
    alignItems: "center",
    elevation: 3
  },
  // amenitiesContainer: {
  //   flexDirection: 'row'
  // },
  mapButtonText: {
    color: "white",
    fontStyle: 'italic',
    fontSize: 16,
    fontWeight: '900',
  },
  detailView: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0, // Align to the bottom of the screen
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    padding: 20,
    zIndex: 4,
    flex: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    // backgroundColor:'#ccc',
    marginRight: 4,
    padding: 6,
    borderRadius: 5,

  },
  icons: {
    // backgroundColor:'#ccc',
    marginRight: 4,
    padding: 6,
    borderRadius: 5,

  },
  infoText: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 11,
    color: "#fff",
  },
  ratingContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 55,
    height: 19,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green', // Or any color you prefer
    padding: 3,
    borderTopStartRadius: 5,
    borderTopEndRadius: 5,
  },
  starIcon: {
    marginRight: 2,
  },
  ratingText: {
    color: 'white',
    fontSize: 12,
  },
  ratingCount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAEAEA', // Or any color you prefer
    padding: 3,
    borderBottomStartRadius: 5,
    borderBottomEndRadius: 5,
  },
  userIcon: {
    marginRight: 2,
  },
  ratingCountText: {
    color: 'black',
    fontSize: 12,
  },
  verticalLine: {
    height: 20,
    position: 'absolute',
    top: -12,
    left: 9,
    zIndex: -1,
  },
  /////// for FRom To details-------------------------------
  stopContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
    padding: 20,
    borderRadius: 20,
    elevation: 3,
  },
  stopName: {
    marginLeft: 20,
    alignItems: 'center',
    color: 'white',
    fontSize: 17,
    fontStyle: 'italic',
    fontWeight: "bold",
    textTransform: 'capitalize',
  },
  iconfrto: {
    // elevation: 5,
    backgroundColor: 'white',
    borderColor: '#000',
    borderWidth: 1.5,
    padding: 5,
    borderRadius: 30,
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 1 },
  },
  locationindivator: {
    backgroundColor: 'white',
    padding: 4,
    paddingHorizontal: 9,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    color: 'black',
    fontStyle: 'italic',
    fontWeight: '900',
    textTransform: 'uppercase',
    fontSize: 18,
    marginLeft: 10,
    elevation: 3,
    shadowColor: 'orange',
  },
  progress: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'orange',
    elevation: 8,

  },
  progressItems: {
    // backgroundColor:'green',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  progressItem: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 10,
  },
  crossed: {
    opacity: 1, // Gray out crossed stops
  },
  boarding: {
    // Add styles for the boarding point if needed
  },
  boardingLocation: {
    fontWeight: 'bold', // Boarding location text style
    color: 'white',
  },
  boardingLocationName: {
    fontWeight: 'bold', // Boarding location name text style
  },
  location: {
    fontSize: 14,
    color: 'white', // Default location text color
    fontStyle: 'italic',
    fontWeight: 'bold',
    maxWidth: 80,
    textAlign: 'left',
    left: 35,
  },
  locationName: {
    fontStyle: 'italic',
    fontSize: 21,
    fontWeight: 'bold',
    minWidth: 100,
    textAlign: 'center',
    flex: 1

  },
  totalorgin: {
    // backgroundColor:"blue",
    minWidth: 140,

  },

  time: {
    fontStyle: 'italic',
    fontSize: 14,
    color: '#000',
    backgroundColor: '#EAEAEA',
    padding: 5,
    borderRadius: 5,
    textAlign: 'center',
    marginTop: 5,
    maxWidth: 70,
    left: 35
  },
  swap: {
    position: 'absolute',
    top: 30,
    left: 160,
  },
  line: {
    width: 2,
    backgroundColor: '#ccc',
    alignSelf: 'center',
  },

  ////--------------------------------------
  //bus moving style
  trContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20, // Adjust padding as needed
    paddingVertical: 10,
  },
  dottedLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    borderColor: '#ccc', // Or your desired dotted line color
    marginHorizontal: 5,
  },
  stopsText: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333', // Or your desired text color
    marginHorizontal: 5,
  },
  busIconContainer: {
    width: 30, // Adjust size as needed
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  busIcon: {
    width: 20, // Adjust size as needed
    height: 20,
    resizeMode: 'contain',
  },//--------------------------------------------
  AmeniContainer2: {

    marginBottom: 10

  },

  AmeniTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  amenitiesContainer: {
    flexDirection: 'row', // Display amenities horizontally
    flexWrap: 'wrap', // Allow wrapping to the next line
    marginTop: 6,
    marginBottom: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 30,
    // paddingBottom: -5,
    elevation: 4
  },
  amenityItem: {
    height: 40,
    width: 60,
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 10, // Add spacing between items
    marginBottom: 7,
    backgroundColor: '#fff',
    // maxHeight: 100,
    // backgroundColor: 'red',
    justifyContent: 'center',
    // padding: 2,
    borderRadius: 10,
  },
  iconsAme: {
    marginRight: 5,
  },
  AmeniText: {
    // color: 'white',
    fontSize: 9,
    width: '100%',
    flex: 1,
    textAlign: 'center',
  },
  BustypeContainer: {
    flexDirection: 'row', // Display amenities horizontally
    flexWrap: 'wrap', // Allow wrapping to the next line
    marginTop: 6,
    marginBottom: 5,
    // backgroundColor: 'orange',
    padding: 10,
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingBottom: -5,
    // elevation: 5
  },
  BusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10, // Add spacing between items
    marginBottom: 7,
    height: 15,
    width: 60,
    backgroundColor: 'orange',
    // backgroundColor: 'yellow',
    justifyContent: 'center',
    // padding: 4,
    borderRadius: 2,
    textAlign: 'center',
  },
  BusText: {
    fontSize: 12,
    textTransform: 'uppercase',
    // width: 100,
    flex: 1,
    textAlign: 'center',
    // overflow: 'hidden',
    // marginRight:10,
    // backgroundColor:'red',
  },
  AmeniContainer1: {
    // backgroundColor: 'red'

  },

});
export default SearchResultsScreen;
