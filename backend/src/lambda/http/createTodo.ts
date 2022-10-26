import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import {cors, httpErrorHandler} from 'middy/middlewares'
import {CreateTodoRequest} from '../../requests/CreateTodoRequest'
import {getUserId} from '../utils';
import * as uuid from 'uuid'
import {createTodo} from '../../businessLogic/todos'
import {createLogger} from "../../utils/logger";

const logger = createLogger('createTodo')
export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        logger.info('Processing event: ', event)
        logger.info('Create a new Todo')
        const createNewTodoRequest: CreateTodoRequest = JSON.parse(event.body)
        const todoId = uuid.v4()
        const userId = getUserId(event)
        const newItem = await createTodo(createNewTodoRequest, userId, todoId)
        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                item: newItem
            })
        }
    })

handler.use(
    cors({
        credentials: true
    })
).use(httpErrorHandler())
