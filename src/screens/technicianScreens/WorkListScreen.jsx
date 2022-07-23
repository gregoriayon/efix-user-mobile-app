import React, { useEffect, useState, useContext } from "react";
import { View, SafeAreaView, FlatList, ImageBackground } from "react-native";
import { Searchbar } from "react-native-paper";

import Ionicons from "react-native-vector-icons/Ionicons";
import {
  Text,
  Heading,
  Center,
  Badge,
  Box,
  Flex,
  HStack,
  Spacer,
  Pressable,
  Button,
  Icon,
} from "native-base";

import { AuthContext } from "../../Context/AuthContext";
import { BASE_URL } from "../../utils/apiUrls";
import { handleError } from "../../utils/LocalStoreCustomFunc";

import axios from "axios";

const WorkListScreen = ({ navigation }) => {
  const [serviceItems, setServiceItems] = useState("");
  const [search, setSearch] = useState("");

  const { user } = useContext(AuthContext);

  const getCreateServiceList = async () => {
    await axios
      .get(
        `${BASE_URL}/service_request/?technician=${user?.id}&search=${search}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        // console.log(res.data);
        setServiceItems(res.data);
      })
      .catch((error) => handleError(error));
  };

  //   console.log(serviceItems);
  const getStatusPerfactValue = (item) => {
    // console.log(typeof item.status);
    if (item.status === "new") {
      return "New";
    } else if (item.status === "in_progress") {
      return "In Progress";
    } else if (item.status === "waittingoncustomer") {
      return "Waitting on Customer";
    } else if (item.status === "fixed") {
      return "Fixed";
    } else if (item.status === "closed") {
      return "Closed";
    } else if (item.status === "cancelled") {
      return "Cancelled";
    } else {
      return "None";
    }
  };

  useEffect(() => {
    getCreateServiceList();
  }, [search]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#bab9b6" }}>
      <View
        style={{
          backgroundColor: "#286fad",
          width: "100%",
          height: 100,
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
          shadowColor: "#4a4848",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.8,
          shadowRadius: 2,
          elevation: 5,
        }}
      ></View>

      <View
        style={{
          backgroundColor: "#dbd9d9",
          marginTop: 10,
          padding: 18,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        }}
      >
        <Searchbar
          placeholder="Search Service"
          onChangeText={(value) => setSearch(value)}
          value={search}
        />
      </View>

      <FlatList
        h="100%"
        w="100%"
        style={{
          flex: 1,
          backgroundColor: "#dbd9d9",
          marginTop: 10,
        }}
        ListHeaderComponent={
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <Heading size="md" color="#333" mt="5" ml="5">
              Work List View
            </Heading>
            <Heading size="md" color="#333" mt="5" mr="5">
              Total List: {serviceItems.length}
            </Heading>
          </View>
        }
        ListEmptyComponent={
          <Center
            style={{
              paddingVertical: 120,
              paddingHorizontal: 50,
            }}
          >
            <ImageBackground
              source={require("../../../assets/images/no-data.gif")}
              style={{
                width: 250,
                height: 250,
              }}
            />
          </Center>
        }
        data={serviceItems}
        renderItem={({ item }) => (
          // navigation.navigate("Details Service", { service: item })
          <Box shadow={2} bg="lightBlue.50" p="3" mb="3" mx="4" rounded="10">
            <HStack alignItems="center">
              <Badge
                colorScheme={"info"}
                _text={{
                  textTransform: "capitalize",
                }}
                variant="solid"
                rounded="4"
              >
                {item.servicereq_no}
              </Badge>
              <Spacer />
              <HStack color="coolGray.800" alignItems="center">
                <Icon as={Ionicons} name="calendar-outline" size="xs" mr="1" />
                <Text fontSize="xs">{item.created_at}</Text>
              </HStack>
            </HStack>
            <Text color="coolGray.800" mt="1" fontWeight="medium" fontSize="xl">
              {item.title}
            </Text>
            <HStack color="warning.600" alignItems="center">
              <Icon
                color="warning.600"
                as={Ionicons}
                name="list-circle-outline"
                size="sm"
                mr="1"
              />
              <Text
                color="warning.600"
                fontSize="sm"
                style={{ textTransform: "capitalize" }}
              >
                {getStatusPerfactValue(item)}
              </Text>

              {item ? (
                item.status === "closed" ? (
                  <Button
                    size="xs"
                    ml="4"
                    px="1"
                    py="1"
                    colorScheme="green"
                    variant="outline"
                    onPress={() =>
                      navigation.replace("Create Invoice", { workID: item.id })
                    }
                  >
                    Create Invoice
                  </Button>
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}
            </HStack>
            <Flex direction="row" justify="space-between" align="center" mt="1">
              <Pressable
                onPress={() =>
                  navigation.navigate("Details Work", { service: item })
                }
              >
                {({ isHovered, isFocused, isPressed }) => {
                  return (
                    <>
                      {isPressed ? (
                        <Text
                          mt="2"
                          fontSize={16}
                          fontWeight="medium"
                          textDecorationLine="underline"
                          color="darkBlue.600"
                          alignSelf="flex-start"
                        >
                          View Details
                        </Text>
                      ) : (
                        <Text
                          mt="2"
                          fontSize={16}
                          fontWeight="medium"
                          color="darkBlue.600"
                        >
                          View Details
                        </Text>
                      )}
                    </>
                  );
                }}
              </Pressable>

              <Badge
                size="sm"
                py="1"
                px="2"
                variant="subtle"
                colorScheme={
                  item.priority == "High"
                    ? "error"
                    : item.priority == "Medium"
                    ? "amber"
                    : "lime"
                }
                _text={{ textTransform: "capitalize" }}
                leftIcon={
                  <Icon as={Ionicons} name="filter-outline" size="xs" />
                }
              >
                {item.priority}
              </Badge>
            </Flex>
          </Box>
        )}
        keyExtractor={(item) => item.id}
      />
      <View
        style={{
          margin: 23,
        }}
      ></View>
    </SafeAreaView>
  );
};

export default WorkListScreen;