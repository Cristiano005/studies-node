function createUser(name) {
    return {
        name, age: undefined, active: true
    }
}

class Pizza {
    constructor(flavour, price) {
        this.flavour = flavour
        this.price = price
    }
}

export {
    Pizza, createUser
}