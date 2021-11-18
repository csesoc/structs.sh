import { Router } from 'express';
import consola from 'consola';
import { TopicMongoService } from 'src/database-helpers/topic';
import { Topic } from 'src/typedefs/topic/Topic';
import { TopicModel } from 'src/schemas/topic/topic';

const topicRouter = Router();
const topicService = new TopicMongoService();

interface CreateTopicInput {
    title: string;
    description: string;
    courses: string[];
}

/**
 * @swagger
 * /api/topics:
 *  get:
 *      summary: Fetches topics
 *      description: Fetches all topics.
 *      tags:
 *          - Topics
 *      responses:
 *          '200':
 *              description: Succesfully fetched all topics
 *              content:
 *                  application/json:
 *                     schema:
 *                         type: object
 *                         properties:
 *                             statusText:
 *                                 type: string
 *                             topics:
 *                                 type: array
 *                                 items:
 *                                     $ref: '#/components/schemas/Topic'
 *          '500':
 *              description: Structs.sh failed to fetch all topics
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 */
topicRouter.get('/api/topics', async (_, response) => {
    try {
        const topics: Topic[] = await topicService.getAllTopics();
        return response.status(200).json({
            statusText: `Successfully fetched all topics`,
            topics: topics,
        });
    } catch (err) {
        consola.error(`Failed to fetch topics. Reason: `, err);
        response.status(500).json({
            statusText: `Failed to fetch topics. Reason: ${err.message}`,
        });
    }
});

/**
 * @swagger
 * /api/topics:
 *  post:
 *      summary: Creates a topic 
 *      description: Creates a new topic
 *      tags:
 *          - Topics
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          title:
 *                              type: string
 *                          description:
 *                              type: string
 *                          courses:
 *                              type: string[]
 *      responses:
 *          '200':
 *              description: successfully created new topic
 *              content:
 *                  application/json:
 *                     schema:
 *                         type: object
 *                         properties:
 *                             statustext:
 *                                 type: string
 *          '400':
 *              description: Invalid arguments
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 */
topicRouter.post('/api/topics', async (request, response) => {
    try {
        const { title, description, courses } = request.body as CreateTopicInput;
        const topic: Topic = await topicService.createTopic(title, description, courses);
        
        consola.success('Lesson successfully created');
        return response.status(200).json({
            statusText: 'Successfully created new topic',
            topic: topic
        })
    } catch(err) {
        consola.error("Failed to create topic. Reason: ", err);
        response.status(500).json({
            statusText: `Failed to create topic. Reason: ${err.message}`;
        })
    }
});

/**
 * @swagger
 * /api/topics/{id}:
 *  get:
 *      summary: Fetches a topic by ID
 *      description: Fetches a topic by ID.
 *      tags:
 *          - Topics
 *      parameters:
 *          - name: id
 *            in: path
 *            required: true
 *            description: ID of the topic to fetch
 *            schema:
 *                type: string
 *      responses:
 *          '200':
 *              description: Succesfully fetched topic
 *              content:
 *                  application/json:
 *                     schema:
 *                         type: object
 *                         properties:
 *                             statusText:
 *                                 type: string
 *                             topic:
 *                                 $ref: '#/components/schemas/Topic'
 *          '404':
 *              description: No topic with the given ID exists.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 */
topicRouter.get('/api/topics/:id', async (req, res) => {
    try {
        const id = req.params.id as string;

        const topic: Topic = await topicService.getTopicById(id);

        return res.status(200).json({
            statusText: `Successfully fetched topic`,
            topic: topic,
        });
    } catch (err) {
        consola.error(`Failed to fetch topics. Reason: `, err);
        res.status(500).json({
            statusText: `Failed to fetch topics. Reason: ${err.message}`,
        });
    }
});

/**
 * @swagger
 * /api/topics/{id}:
 *  put:
 *      summary: Edits a topic (TODO!)
 *      description: Edits an existing topic
 *      tags:
 *          - Topics
 *      responses:
 *          '200':
 *              description: successfully created new topic
 *              content:
 *                  application/json:
 *                     schema:
 *                         type: object
 *                         properties:
 *                             statustext:
 *                                 type: string
 *          '400':
 *              description: Invalid arguments
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 */
topicRouter.put('/api/topics/:id', async (req, res) => {
    throw new Error('Unimplemented');

    // try {
    //     const { lessonId, topicId, title, rawMarkdown, creatorId } = req.body;
    //     ...
    // } catch (err) {
    //     consola.error('Failed. Reason: ', err);
    //     res.status(400).json({
    //         statusText: `Failed. Reason: ${err.message}`,
    //     });
    // }
});

/**
 * @swagger
 * /api/topics/{id}:
 *  delete:
 *      summary: Deletes a topic (TODO!)
 *      description: Deletes a topic
 *      tags:
 *          - Topics
 *      responses:
 *          '200':
 *              description: Successfully deleted topic
 *              content:
 *                  application/json:
 *                     schema:
 *                         type: object
 *                         properties:
 *                             statustext:
 *                                 type: string
 *          '404':
 *              description: Couldn't find topic with that ID
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 */
topicRouter.delete('/api/topics/:id', async (req, res) => {
    throw new Error('Unimplemented');

    // try {
    //     const id = req.params.id;
    //     ...
    // } catch (err) {
    //     consola.error('Failed. Reason: ', err);
    //     res.status(400).json({
    //         statusText: `Failed. Reason: ${err.message}`,
    //     });
    // }
});

export default topicRouter;
