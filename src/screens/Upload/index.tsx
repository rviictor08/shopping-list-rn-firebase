import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Button } from "../../components/Button";
import { Header } from "../../components/Header";
import { Photo } from "../../components/Photo";

import { Container, Content, Progress, Transferred } from "./styles";

import storage from "@react-native-firebase/storage";
import { Alert } from "react-native";

export function Upload() {
  const [image, setImage] = useState("");
  const [bytesTransfered, setBytesTransfered] = useState("")
  const [progress, setProgress] = useState("0");

  async function handlePickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status == "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);
      }
    }
  }

  async function handleUpload() {
    const fileName = new Date().getTime();
    const MIME = image.match(/\.(?:.(?!\.))+$/);
    console.log(image);
    console.log(MIME);
    const reference = storage().ref(`/images/${fileName}${MIME}`);

    // reference
    // .putFile(image)
    // .then(() => Alert.alert("Sucesso!", "Upload concluído."))
    // .catch( (error) => console.log(error));

    const uploadTask = reference.putFile(image);
    uploadTask
    .on("state_changed", taskSnapShot => {
      //percentual de bytes transferidos / por total de bytes que contem no arq.
      const percent = ((taskSnapShot.bytesTransferred / taskSnapShot.totalBytes) * 100).toFixed(0);
      setProgress(percent);
      setBytesTransfered(`${taskSnapShot.bytesTransferred} transferidos de ${taskSnapShot.totalBytes}`)
    })

    uploadTask.then(() => {
      Alert.alert("Sucesso!", "Upload concluído com sucesso.");
    })
  }

  return (
    <Container>
      <Header title="Lista de compras" />

      <Content>
        <Photo uri={image} onPress={handlePickImage} />

        <Button title="Fazer upload" onPress={handleUpload} />

        <Progress>
          {progress}%
        </Progress>

        <Transferred>
          {bytesTransfered}
        </Transferred>
      </Content>
    </Container>
  );
}