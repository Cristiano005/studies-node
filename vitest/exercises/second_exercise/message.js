export default class Message {

    #session = {
        messages: {}
    }

    getMessage(key) {
        if (this.#session.messages[key]) return this.#session.messages[key];
        return null
    }

    setMessage(key, message) {
        this.#session.messages[key] = message
    }
}