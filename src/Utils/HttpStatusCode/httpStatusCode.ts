export class HttpStatusCode {
    ok() {
        return 200;
    }

    created() {
        return 201;
    }

    accepted() {
        return 202;
    }

    noContent() {
        return 204;
    }

    resetContent() {
        return 205;
    }

    partialContent() {
        return 206;
    }

    badRequest() {
        return 400;
    }

    unauthorized() {
        return 401;
    }

    paymentRequired() {
        return 402;
    }

    accessForbidden() {
        return 403;
    }

    notFound() {
        return 404;
    }

    methodNotAllowed() {
        return 405;
    }

    notAccepted() {
        return 406;
    }

    proxyAuthenticationRequired() {
        return 407;
    }

    requestTimeout() {
        return 408;
    }

    conflict() {
        return 409;
    }

    unprocessableEntity() {
        return 422;
    }

    internalServerError() {
        return 500;
    }

    notImplemented() {
        return 501;
    }

    badGateway() {
        return 502;
    }

    serviceUnavalaibleError() {
        return 503;
    }

    gatewayTimeout() {
        return 504;
    }
}

export const statusCode = new HttpStatusCode();
