import { useState, useEffect, useRef, } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import React from "react";
import axios from "axios";
import config from "../../../config";
import RecentSearches from "../Components/RecentSearch";
import ImageSlider from "../Components/ImageSlider";
import HorizontalInfoCards from "../Components/HorizontalInfoCards";
import { InfoCardData } from "../../utils/InfoCardData";
import FAQ from "../Components/FAQ";
import { faqData } from "../../utils/faqData";
import SupportFeedback from "../Components/SupportFeedback";
import SearchFields from "./SearchFeilds";
import PromotionalContent from "../Components/PromotionalContent";
import { promotionData } from "../../utils/promotionalData";

interface RouteParams {
  routeId?: number;
}

const RouteScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [selectedRoute, setSelectedRoute] = useState(null);


  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [busRoutes, setBusRoutes] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noRoutesFound, setnoRouteFound] = useState(false);

  const [showAllRecentSearches, setShowAllRecentSearches] = useState(false);
  const [showSearchFields, setShowSearchFields] = useState(false); // Add this state

  const images = [
    require('../Components/asset/bus images/bus1.jpg'),
    require('../Components/asset/bus images/bus2.jpg'),
    require('../Components/asset/bus images/bus3.jpg'),
    require('../Components/asset/bus images/bus4.jpg'),
  ];

  //blur 
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  ///------------------initial rentering-----------------///
  useEffect(() => {
    const fetchBusRoutes = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${config.apibaseUrl}/findRoutes`
        );
        //findRoutes
        if (response.data) {
          setBusRoutes(response.data);
        } else {
          setBusRoutes([]);
        }
      } catch (err: any) {
        console.error("Error fetching bus routes:", err);
        setError(err.message || "Network Error");
        setBusRoutes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBusRoutes();
  }, []);

  //----------------must for recent search Storing------------//
  const handleSearch = () => {
    setLoading(true);
    setError(null);

    const from = fromLocation.trim().toLowerCase();
    const to = toLocation.trim().toLowerCase();

    if (!fromLocation.trim() || !toLocation.trim()) {
      setError("Please enter From and To fields");
      setTimeout(() => {
        setError("");
      }, 3000);
      setLoading(false);
      return;
    }

    axios
      .get(`${config.apibaseUrl}/findRoutes?from=${from}&to=${to}`)
      .then((response) => {
        setBusRoutes(response.data);
        setLoading(false);

        if (Array.isArray(response.data) && response.data.length === 0) {
          setnoRouteFound(true);
        } else {
          setnoRouteFound(false);

          // Update recent searches using the prop function
          recentSearchesRef.current?.updateRecentSearches({ from, to });

          navigation.navigate('SearchResults', {
            searchResults: response.data,
            from: fromLocation,
            to: toLocation,
            date: selectedDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          });
        }
      })
      .catch((error) => {
        console.error("Error finding routes:", error);
        setError("Network Error. Please try again.");
        setLoading(false);
      });

    fromInputRef.current?.blur();
    toInputRef.current?.blur();
  };

  const handleRecentSearch = (from: string, to: string) => {
    setFromLocation(from);
    setToLocation(to);
    handleSearch();
  };

  const recentSearchesRef = useRef<RecentSearches>(null); // Create a ref


  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={"small"} color="teal" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : null}


      {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
      {noRoutesFound && (
        <Text style={styles.noRouteMessage}>
          No route found for your Search...
        </Text>
      )}

      <SearchFields onSearch={() => setShowSearchFields(false)} />
      <RecentSearches
        ref={recentSearchesRef}
        showAllRecentSearches={showAllRecentSearches}
        setShowAllRecentSearches={setShowAllRecentSearches}
        onSearch={handleRecentSearch}
        addNewSearch={(newSearch) => recentSearchesRef.current?.updateRecentSearches(newSearch)} // Pass the addNewSearch prop
      />
      {/* <ImageSlider images={images} imageHeight={100} /> */}
      <HorizontalInfoCards cards={InfoCardData} />
      <PromotionalContent promotions={promotionData} />
      <FAQ faqData={faqData} />
      <SupportFeedback phoneNumber="+7091566641" email="dinesh7091566641@gmail.com" feedbackFormUrl="#" />


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "aliceblue",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  noRouteMessage: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 4,
  },
  errorMessage: {
    color: "red",
    marginTop: 5,
    marginBottom: 10,
    textAlign: "center",
  },

});

export default RouteScreen;