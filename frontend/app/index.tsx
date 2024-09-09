import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React, { useState, useEffect, useRef } from "react";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.33;
const CARD_MARGIN = width * 0.02;

export default function Index() {
  const [states, setStates] = useState([]); // will be a list of states
  const [activeIndex, setActiveIndex] = useState(0);
  // create ref for scrollView so we can know where it is
  const scrollRef = useRef(null);

  useEffect(() => {
    // function to fetch states from our server

    const fetchStates = async () => {
      const res = await fetch("http://localhost:4040");
      const data = await res.json();
      // let's console log to see if they show up
      console.log(data.slice(0, 6)); // show less for dots for right now
      setStates(data.slice(0, 6));
    };

    fetchStates(); // looking good
  }, []);

  const handleScroll = (event: {
    nativeEvent: { contentOffset: { x: any } };
  }) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / (CARD_WIDTH + CARD_MARGIN));
    setActiveIndex(index);
  };

  const scrollToIndex = (index: number) => {
    scrollRef.current!.scrollTo({
      x: index * (CARD_MARGIN + CARD_WIDTH),
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Savings carousel test</Text>
      {/* render the states --> useEffect */}
      <View style={styles.carouselContainer}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollViewContainer}
          horizontal
          decelerationRate="fast"
          snapToInterval={CARD_MARGIN + CARD_WIDTH}
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {states.map((state, index) => (
            <TouchableOpacity
              activeOpacity={0.8}
              key={index}
              onPress={() => scrollToIndex(index)}
            >
              <View
                style={[
                  styles.card,
                  activeIndex == index ? styles.activeCard : null,
                ]}
              >
                <Text style={styles.stateTitle}>{state.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {/* pagination dots sections */}
      <View style={styles.pagination}>
        <TouchableOpacity
          onPress={() => scrollToIndex(Math.max(0, activeIndex - 1))}
        >
          <ChevronLeft color="black" size={24} />
        </TouchableOpacity>
        <View style={styles.dotContainer}>
          {states.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index == activeIndex ? styles.activeDot : null,
              ]}
            ></View>
          ))}
        </View>
        <TouchableOpacity
          onPress={() =>
            scrollToIndex(Math.min(states.length - 1, activeIndex + 1))
          }
        >
          <ChevronRight color="black" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    paddingHorizontal: 30,
  },
  container: {
    flex: 1, // copying from above
    paddingTop: 100,
  },
  carouselContainer: {
    height: 120,
  },
  card: {
    width: CARD_WIDTH,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    marginHorizontal: CARD_MARGIN,
  },
  scrollViewContainer: {
    paddingHorizontal: 30,
  },
  stateTitle: {
    fontSize: 15,
    fontWeight: "500",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#bdbdbd", // preset color found here
    marginHorizontal: 5,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  // have one for active
  activeDot: {
    backgroundColor: "black",
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  activeCard: {
    backgroundColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOpacity: 0.25,
  },
});
