import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as middy from 'middy'
import {cors, httpErrorHandler} from 'middy/middlewares'
import {getUserId} from '../utils'
import {getGeneratedUploadURL} from "../../businessLogic/todos"
import {createLogger} from "../../utils/logger";

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const todoId = event.pathParameters.todoId
        const userId: string = getUserId(event)
        if (!todoId) {
            return {
                statusCode: 400,
                body: JSON.stringify({error: 'todoId was not provided'})
            }
        }

        const signedUrl = await getGeneratedUploadURL(todoId, userId)

        let logger = createLogger('generateUploadUrl');
        logger.info(`Generated signed url for a TODO`, {
            url: signedUrl,
            todoId: todoId
        })

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                uploadUrl: signedUrl
            })
        }
    }
)

handler
    .use(httpErrorHandler())
    .use(
        cors({
            credentials: true
        })
    )
