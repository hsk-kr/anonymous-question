import React, { useEffect, useRef, useState } from "react";
import { ipcRenderer } from "electron";
import styled from "@emotion/styled";
import Head from "next/head";

import {
  SEND_QUESTION,
  TOGGLE_EVENT_REQ,
  TOGGLE_EVENT_RES,
} from "../../shares/constants";
import { Question as TQuestion } from "../../shares/types";
import Header from "../components/Header";
import Question from "../components/Question";

const Container = styled.div`
  height: 100%;
`;

const Content = styled.div`
  background-color: #ecf0f1;
  height: calc(100% - 64px);
`;

const QuestionContainer = styled.div`
  box-sizing: border-box;

  padding: 24px;
  margin-top: auto;
  max-height: 100%;
  overflow: auto;
`;

function Home() {
  const [working, setWorking] = useState(false);
  const [serverOn, setServerOn] = useState(false);
  const [questions, setQuestions] = useState<TQuestion[]>([]);
  const questionContainerRef = useRef<HTMLDivElement>(null);

  const handleServerToggle = () => {
    ipcRenderer.send(TOGGLE_EVENT_REQ, !serverOn);
    setWorking(true);
  };

  const scrollToBottom = () => {
    if (!questionContainerRef.current) return;

    questionContainerRef.current.scrollTo({
      top: questionContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    ipcRenderer.on(TOGGLE_EVENT_RES, () => {
      setServerOn((prev) => !prev);
      setWorking(false);
    });

    ipcRenderer.on(SEND_QUESTION, (_, question: TQuestion) => {
      setQuestions((prevQuestions) => prevQuestions.concat(question));
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [questions]);

  return (
    <Container>
      <Head>
        <title>Anonymous Question</title>
      </Head>
      <Header
        serverOn={serverOn}
        onServerToggle={handleServerToggle}
        serverOnDisabled={working}
      />
      <Content>
        <QuestionContainer ref={questionContainerRef}>
          {questions.map((q, qIdx) => (
            <Question key={qIdx} {...q} />
          ))}
        </QuestionContainer>
      </Content>
    </Container>
  );
}

export default Home;
