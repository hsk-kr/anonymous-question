import React, { useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import Head from "next/head";
import { Layout } from "antd";

import { TOGGLE_EVENT_REQ, TOGGLE_EVENT_RES } from "../../types/constants";
import Header from "../components/Header";
import Question from "../components/Question";

function Home() {
  const [working, setWorking] = useState(false);
  const [serverOn, setServerOn] = useState(false);

  const handleServerToggle = () => {
    ipcRenderer.send(TOGGLE_EVENT_REQ, !serverOn);
    setWorking(true);
  };

  useEffect(() => {
    ipcRenderer.on(TOGGLE_EVENT_RES, () => {
      setServerOn((prev) => !prev);
      setWorking(false);
    });
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Anonymous Question</title>
      </Head>
      <Header
        serverOn={serverOn}
        onServerToggle={handleServerToggle}
        serverOnDisabled={working}
      />
      <Layout.Content
        style={{
          padding: 24,
          backgroundColor: "#ecf0f1",
          height: "calc(100vh - 64px)",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <Question nickname="Q" question="question" />
        <Question
          nickname="K"
          question="question 2question 2question 2question 2question 2question 2question 2question 2question 2question 2question 2question 2question 2question 2question 2"
        />
        <Question nickname="Q" question="question 3" />
      </Layout.Content>
    </React.Fragment>
  );
}

export default Home;
