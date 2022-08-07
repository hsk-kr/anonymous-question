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
 *            $ref: './schemas/question.ts'
 *    responses:
 *      "200":
 *        description: Succeed to request a question
 *        content:
 *          application/json:
 *            schema:
 *              $ref: './schemas/quesiton.ts'
 */
import express from "express";

const router = express.Router();

router.post("/questions", (req, res) => {
  if (!req.body.question) {
    return res.status(400).send("Bad Request");
  }

  const question = req.body.question;

  res.send("ok " + question);
});

export default router;
