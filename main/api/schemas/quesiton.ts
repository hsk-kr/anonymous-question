/**
 * @swagger
 *  components:
 *    schemas:
 *      Question:
 *        type: object
 *        required:
 *          - nickname
 *          - question
 *        properties:
 *          nickname:
 *            type: string;
 *            minLength: 1
 *            maxLength: 1
 *          question:
 *            type: string;
 *            minLength: 1
 *            maxLength: 100
 *        example:
 *          nickname: S
 *          question: What is your name?
 */

export {};
