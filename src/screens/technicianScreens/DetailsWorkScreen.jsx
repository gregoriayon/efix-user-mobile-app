import React, { useState, useContext } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Container, Box, ScrollView, Heading, Link, Button } from "native-base";
import { useForm } from "react-hook-form";

import Ionicons from "react-native-vector-icons/Ionicons";

import Loading from "../../utils/Loading";
import LoadingContext from "../../Context/LoadingContext";

import {
  CreateServiceInput,
  CreateServiceSelectPriority,
  CreateServiceSelectStatus,
  CreateServiceTextArea,
} from "../../components/CustomerComponents/CustomFieldsCustomer";

import { BASE_URL } from "../../utils/apiUrls";
import axios from "axios";

const DetailsWorkScreen = ({ route, navigation }) => {
  const { service } = route.params;
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm({
    defaultValues: {
      title: service.title,
      status: service.status,
      priority: service.priority,
      details: service.details,
    },
  });

  const { loading, setLoading } = useContext(LoadingContext);

  const handleServiceUpdate = async (data) => {
    setLoading(true);

    const serviceObjData = new FormData();
    serviceObjData.append("status", data.status);

    // console.log(serviceObjData);

    await axios
      .patch(`${BASE_URL}/service_request/${service.id}/`, serviceObjData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        // console.log(res);
        if (res.status === 200) {
          Alert.alert("Success", "Service Status Updated successful!");
          navigation.replace("Work List");
        }
      })
      .catch((err) => {
        for (const [key, value] of Object.entries(err.response.data)) {
          Alert.alert("Error", String(value));
        }
      });
    setLoading(false);
  };

  if (loading) {
    return <Loading />;
  }

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

      <ScrollView
        h="100%"
        w="100%"
        bg="blue.50"
        mt="2"
        style={{ borderTopLeftRadius: 15, borderTopRightRadius: 15 }}
      >
        <Container h="100%" w="100%" maxWidth="100%">
          <Box width="100%" padding="5">
            <Heading size="md" color="#333" mb="5">
              Details Service View
            </Heading>

            <CreateServiceInput
              isReadOnly={true}
              type="text"
              name="title"
              label="Service Title"
              placeholder="Enter Title"
              control={control}
              rules={{ required: "Field is required", minLength: 3 }}
              errors={errors}
            />

            <CreateServiceSelectStatus
              name="status"
              label="Select Status"
              control={control}
              rules={{ required: "Field is required", minLength: 3 }}
              errors={errors}
            />

            <CreateServiceSelectPriority
              isDisabled={true}
              name="priority"
              label="Select Priority"
              control={control}
              rules={{ required: "Field is required", minLength: 3 }}
              errors={errors}
            />

            <CreateServiceTextArea
              isReadOnly={true}
              type="text"
              name="details"
              label="Service Details"
              placeholder="Enter Details"
              control={control}
              rules={{ required: "Field is required", minLength: 3 }}
              errors={errors}
            />

            <View
              style={{
                marginTop: 10,
                marginBottom: 5,
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="calendar"
                size={15}
                style={{ marginRight: 3 }}
                color="#bdbbbb"
              />
              <Text
                style={{ color: "#808080", marginTop: 5, fontWeight: "700" }}
              >
                Create Date: {service.created_at}
              </Text>
            </View>

            <View style={{ marginTop: 5, marginBottom: 10 }}>
              <Text style={{ color: "#808080" }}>
                Download File (If you need.)
              </Text>
              {service.files ? (
                <Link
                  style={{
                    marginTop: 5,
                    backgroundColor: "#999696",
                    padding: 10,
                    width: 100,
                    borderRadius: 5,
                    alignItems: "center",
                  }}
                  href={service.files}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Ionicons name="download" size={20} color="#fff" />
                    <Text
                      style={{
                        color: "#fff",
                        fontWeight: "700",
                        marginTop: 5,
                        marginLeft: 5,
                      }}
                    >
                      Download
                    </Text>
                  </View>
                </Link>
              ) : (
                <Text
                  style={{ color: "#808080", marginTop: 5, fontWeight: "700" }}
                >
                  N.B: No file aviable !
                </Text>
              )}
            </View>

            <Button
              size="sm"
              colorScheme="gray"
              onPress={handleSubmit(handleServiceUpdate)}
            >
              <Text style={{ fontWeight: "600", fontSize: 14, color: "#fff" }}>
                Update Status
              </Text>
            </Button>

            <Heading size="sm" color="#808080" mt="2" mb="1">
              Customer Info:
            </Heading>
            <View
              style={{
                height: 70,
                width: "100%",
                padding: 10,
                borderRadius: 5,
                borderColor: "#d1d1cf",
                borderWidth: 1,
              }}
            >
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 16,
                  color: "#808080",
                }}
              >
                Name: {service.customer.name}
              </Text>
              <Text
                style={{
                  marginTop: 2,
                  fontWeight: "500",
                  fontSize: 14,
                  color: "#808080",
                }}
              >
                Email: {service.customer.email}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: "500",
                    fontSize: 14,
                    color: "#808080",
                  }}
                >
                  Phone: {service.customer.phone}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="person"
                    size={15}
                    style={{ marginRight: 3 }}
                    color="#bdbbbb"
                  />
                  <Text
                    style={{
                      color: "#808080",
                      marginTop: 5,
                      fontWeight: "700",
                    }}
                  >
                    Reg No. {service.customer.reg_no}
                  </Text>
                </View>
              </View>
            </View>
          </Box>
        </Container>
        <View
          style={{
            margin: 23,
          }}
        ></View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailsWorkScreen;