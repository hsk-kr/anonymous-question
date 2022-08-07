import { Avatar, Typography } from "antd";
import styled from "@emotion/styled";

interface QuestionProps {
  nickname: string;
  question: string;
}

let nextRandomColorIdx = 0;
const randomColors = [
  "#f56a00",
  "#e17055",
  "#0984e3",
  "#6c5ce7",
  "#fdcb6e",
  "#00b894",
];

const nicknameColors: { [key: string]: string } = {};

const getNicknameColor = (nickname: string) => {
  if (nicknameColors[nickname]) return nicknameColors[nickname];

  nicknameColors[nickname] = randomColors[nextRandomColorIdx];
  nextRandomColorIdx = (nextRandomColorIdx + 1) % randomColors.length;

  return nicknameColors[nickname];
};

const Container = styled.div`
  &:hover {
    transform: scale(1.05);
  }

  padding: 8px;
  border-bottom: 1px solid #ccc;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  column-gap: 8px;

  > *:first-of-type {
    min-width: 48px;
  }
`;

const Question = ({ nickname, question }: QuestionProps) => {
  return (
    <Container>
      <Avatar
        size={48}
        style={{ backgroundColor: getNicknameColor(nickname), marginRight: 8 }}
      >
        {nickname}
      </Avatar>
      <Typography.Text>{question}</Typography.Text>
    </Container>
  );
};
export default Question;
