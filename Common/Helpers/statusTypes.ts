export const specialStatusResponse = {
    TOKEN_EXPIRED: 1001,
  }
  
  export const statusResponse = {
    // Success
    OK: 200, // The request succeeded.
    CREATED: 201, // The request succeeded, and a new resource was created as a result
    ACCEPTED: 202, // The request has been received but not yet acted upon.
    NON_AUTHORITATIVE_INFORMATION: 203, // Returned metadata is not exactly the same as is available from the origin server
    NO_CONTENT: 204, // There is no content to send for this request, but the headers may be useful
  
   
    // Clinet Error
    BAD_REQUEST: 400, // The server could not understand the request due to invalid syntax.
    UNAUTHORIZED: 401, // That is, the client must authenticate itself to get the requested response.
    FORBIDDEN: 403, // The client does not have access rights to the content, here identity is known
    NOT_FOUND: 404, // The server can not find the requested resource
    METHOD_NOT_FOUND: 405, // The request method is known by the server but is not supported by the target resource
  
    // Server Error
    INTERNAL_SERVER_ERROR: 500, // The server has encountered a situation it does not know how to handle
    NOT_IMPLEMENTED: 501, // The request method is not supported by the server and cannot be handled
    BAD_GATEWAY: 502, // Server while working as a gateway to get a response needed to handle the request, got an invalid response
  }
  