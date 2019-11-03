/* Base model for SuccessModel and ErrorModel,
* takes data and message
*/
class BaseModel {
  constructor (data, message) {
    if (typeof data === 'string') {
      this.message = data;
      data = null;
      message = null;
    }
    if (data) {
      this.data = data;
    }
    if (message) {
      this.message = message;
    }
  }
}

/* Use for a successful action,
* return errno 0
*/
class SuccessModel extends BaseModel {
  constructor (data, message) {
    super(data, message);
    this.errno = 0;
  }
}

/* Use for a failed action,
* return errno -1
*/
class ErrorModel extends BaseModel {
  constructor (data, message) {
    super(data, message);
    this.errno = -1;
  }
}

module.exports = {
  SuccessModel,
  ErrorModel
};
