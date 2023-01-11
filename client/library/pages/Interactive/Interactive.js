import React, { useState } from "react";
import styles from "./Interactive.module.scss";
import withStyles from "react-css-modules";
import { Button, Flex, Grid, Group, TextInput } from "@mantine/core";
import { getTrainingAnswer } from "../../helpers/fetching";
import { showNotification } from "@mantine/notifications";

function Interactive() {
  const [text, setText] = useState("");
  const [data, setData] = useState({
    intent: "",
    answer: "",
    attachments: { buttons: [] },
    entities: [],
  });

  const submitText = async () => {
    getTrainingAnswer(text).then((answer) => setData(answer));
  };

  console.log("Data: ", data);

  return (
    <div className={styles.Interactive}>
      <h1>Training</h1>
      <br />
      <div className={styles.card}>
        <Grid>
          <Grid.Col span={9}>
            <TextInput
              placeholder="Say anything..."
              value={text}
              onChange={(event) => {
                setText(event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  submitText();
                }
              }}
              style={{ width: "100%" }}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <Button
              onClick={() => {
                submitText();
              }}
              style={{ width: "100%" }}
            >
              Say It
            </Button>
          </Grid.Col>
        </Grid>
      </div>
      <div className={styles.card}>
        <Grid>
          <Grid.Col span={12}>
            <Grid>
              <Grid.Col span={9}>
                <TextInput
                  style={{ width: "100%" }}
                  label="Intent"
                  value={data.intent}
                  placeholder="Intent"
                  onChange={(event) => {
                    setData({ ...data, intent: event.target.value });
                  }}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <Button style={{ width: "100%", marginTop: "24px" }}>
                  Save Intent
                </Button>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>
      </div>
    </div>
  );
}

export default withStyles(styles)(Interactive);
