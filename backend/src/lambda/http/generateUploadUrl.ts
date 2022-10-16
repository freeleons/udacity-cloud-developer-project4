import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as middy from 'middy'
import {cors, httpErrorHandler} from 'middy/middlewares'
import {uuid} from "uuid"
import {getUserId} from '../utils'
import {persistAttachmentUrl, getGeneratedUploadURL} from "../../businessLogic/todos"

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const todoId = uuid.v4()
        const userId = getUserId(event)
        const imageId = uuid.v4()

        const signedUrl = await getGeneratedUploadURL(todoId)
        await persistAttachmentUrl(todoId, userId, imageId)

        return {
            statusCode: 201,
            body: JSON.stringify({uploadUrl: signedUrl})
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
