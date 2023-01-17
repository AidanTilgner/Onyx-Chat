import React, { useState } from "react";
import styles from "./Interactive.module.scss";
import withStyles from "react-css-modules";
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  getTrainingAnswer,
  addAnswerToIntent,
  removeAnswerFromIntent,
} from "../../helpers/fetching";
import { showNotification } from "@mantine/notifications";
import { TrashSimple, Copy } from "phosphor-react";
import { copyToClipboard } from "../../helpers/utilities";

function Interactive() {
  const [text, setText] = useState("");
  const [data, setData] = useState({
    intent: "",
    answer: "",
    attachments: { buttons: [] },
    entities: [],
    initial_text: "",
    intent_data: {
      intent: "",
      utterances: [],
      answers: [],
    },
  });
  const [newAnswer, setNewAnswer] = useState("");

  const submitText = async () => {
    getTrainingAnswer(text).then((answer) => {
      setData(answer);
      showNotification({
        title: "Message Received",
        message: `You said: ${text}, and the bot said: ${answer.answer}`,
      });
    });
  };

  const submitNewAnswer = async () => {
    addAnswerToIntent({
      intent: data.intent,
      answer: newAnswer,
    }).then((newIntentData) => {
      console.log("New intent data: ", newIntentData);
      setData({
        ...data,
        intent_data: newIntentData,
      });
      setNewAnswer("");
    });
  };

  const removeAnswer = async (answer) => {
    removeAnswerFromIntent({
      intent: data.intent,
      answer,
    }).then((newIntentData) => {
      setData({
        ...data,
        intent_data: newIntentData,
      });
    });
  };

  const copy = (text) => {
    copyToClipboard(text);
    showNotification({
      title: "Copied to Clipboard",
      message: `Copied: ${text}`,
    });
  };

  return (
    <div className={styles.Interactive}>
      <Grid
        gutter={"md"}
        justify="space-between"
        align="space-between"
        style={{ width: "100%" }}
      >
        <Grid.Col
          span={data.answer ? 6 : 12}
          sx={(theme) => ({
            display: "flex",
            justifyContent: "center",
          })}
        >
          <Card
            shadow={"lg"}
            withBorder
            bg={"white"}
            py={14}
            px={24}
            sx={(theme) => ({
              width: data.answer ? "100%" : "40%",
            })}
          >
            <Flex
              direction={"column"}
              align="flex-start"
              justify="space-around"
            >
              <Title order={3} style={{ marginBottom: "24px" }}>
                Say anything...
              </Title>
              <Flex
                justify={"space-between"}
                style={{ width: "100%" }}
                gap={24}
              >
                <TextInput
                  placeholder="Type here"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      submitText(e);
                    }
                  }}
                  sx={() => ({ width: "100%" })}
                />
                <Button onClick={submitText}>Say it</Button>
              </Flex>
            </Flex>
          </Card>
        </Grid.Col>
        {data?.answer.length > 0 && (
          <>
            <Grid.Col span={6}>
              <Grid>
                <Grid.Col span={12}>
                  <Box
                    sx={(theme) => ({
                      border: `1px solid ${theme.colors.gray[3]}`,
                      padding: "24px 36px",
                      boxShadow: "inset .2px .2px 18px rgba(0, 0, 0, 0.1)",
                    })}
                  >
                    <Flex direction="column" align="flex-start">
                      <div
                        className={`${styles.chat_bubble} ${styles.chat_out}`}
                      >
                        <Text weight={500}>{data?.initial_text}</Text>
                      </div>
                      <div
                        className={`${styles.chat_bubble} ${styles.chat_in}`}
                      >
                        <Text weight={500}>{data?.answer}</Text>
                      </div>
                    </Flex>
                  </Box>
                </Grid.Col>
              </Grid>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text
                size="md"
                weight={500}
                sx={() => ({
                  textAlign: "left",
                  marginTop: "24px",
                  marginBottom: "14px",
                })}
              >
                When you say "{data?.initial_text}", Onyx will give one of the
                following answers:
              </Text>
              <Box
                className={styles.answers}
                sx={() => ({ textAlign: "left" })}
              >
                {data?.intent_data?.answers.map((answer, index) => {
                  return (
                    <Text
                      key={answer}
                      className={styles.answer}
                      weight={400}
                      size="sm"
                    >
                      <span>{answer}</span>
                      <div className={styles.answer_icons}>
                        <div
                          className={`${styles.answer_delete} ${styles.answer_icon}`}
                          title="Remove answer"
                          onClick={() => removeAnswer(answer)}
                        >
                          <TrashSimple size={12} />
                        </div>
                        <div
                          className={`${styles.answer_copy} ${styles.answer_icon}`}
                          title="Copy answer"
                          onClick={() => copy(answer)}
                        >
                          <Copy size={12} />
                        </div>
                      </div>
                    </Text>
                  );
                })}
              </Box>
              <Flex
                justify={"space-between"}
                gap={24}
                sx={() => ({ marginTop: "14px" })}
              >
                <TextInput
                  placeholder={`Add an answer for "${data?.initial_text}"`}
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      submitNewAnswer(e);
                    }
                  }}
                  size="sm"
                  sx={() => ({ width: "100%" })}
                />
                <Button size="sm" onClick={submitNewAnswer}>
                  Add
                </Button>
              </Flex>
            </Grid.Col>
          </>
        )}
      </Grid>
    </div>
  );
}

export default withStyles(styles)(Interactive);
