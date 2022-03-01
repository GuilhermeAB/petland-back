import type {
  NextFunction, Request, RequestHandler, Response,
} from 'express';
import { validationResult } from 'express-validator';
import ValidationError from 'src/util/Error/validation-error';
import type { ParamsType } from 'src/util/i18n/methods/get-message';

const DEFAULT_INTERNAL_ERROR = {
  messages: {
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An internal error occurred',
    },
  },
};

export type CallBackType = (request: Request, response: Response) => Promise<Response>;
type validationResultErrorType = {
  msg: {
    code: string,
    message: string,
    params: ParamsType
  }
};

export default (callback: CallBackType): RequestHandler => async (request: Request, response: Response, next: NextFunction): Promise<Response> => {
  let logError;
  try {
    // Request parameter validation
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      logError = {
        messages: {
          errors: errors.array({ onlyFirstError: true }).map((error: validationResultErrorType) => ({
            code: error.msg.code,
            message: error.msg.message,
            params: error.msg.params,
          })),
        },
      };

      return response.status(400).json(logError);
    }

    const result = await callback(request, response);

    return result;
  } catch (e) {
    if (e instanceof ValidationError) {
      logError = {
        messages: {
          error: {
            code: e.getCode(),
            message: e.getMessage(),
            params: e.getParams(),
          },
        },
      };

      return response.status(400).json(logError);
    }

    logError = DEFAULT_INTERNAL_ERROR;

    next(e);

    return response.status(500).json(logError);
  }
};
