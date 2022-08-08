import { webContents } from "electron";
import { SEND_QUESTION } from "../../shares/constants";

export const sendQuestionMessage = (nickname: string, question: string) => {
  const contents = webContents.getAllWebContents();

  for (const content of contents) {
    content.send(SEND_QUESTION, { nickname, question });
  }
};
