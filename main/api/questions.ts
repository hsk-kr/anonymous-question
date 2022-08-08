import express, { Request } from "express";
import { Question } from "../../shares/types";
import { sendQuestionMessage } from "./ipc";

const router = express.Router();

interface QuestionParams extends Request {
  body: Question;
}

/**
 * @swagger
 * tags:
 *  name: Questions
 *  description: API to manager questions.
 *
 * @swagger
 * /api/questions:
 *  post:
 *    summary: Creates a new question
 *    tags: [Questions]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref:  '#/components/schemas/Question'
 *    responses:
 *      "200":
 *        description: Succeed to request a question
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Question'
 */
router.post("/questions", (req: QuestionParams, res) => {
  if (!req.body.nickname && !req.body.question) {
    return res.status(400).send("Bad Request");
  }

  const question = req.body.question.trim();
  const nickname = req.body.nickname.trim();

  if (nickname.length >= 2) {
    return res
      .status(400)
      .send("Length of the nickname must be less than or equal to 2.");
  } else if (question.length >= 100) {
    return res
      .status(400)
      .send("Length of the quesztion must be less than or equal to 100.");
  }

  sendQuestionMessage(nickname, question);

  return res.json({
    question,
    nickname,
  });
});

export default router;
