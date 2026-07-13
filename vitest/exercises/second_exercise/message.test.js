import { describe, test, expect } from 'vitest';
import Message from './message';

describe('Message Test', () => {

    const message = new Message()

    test('It should return a saved message', () => {
        const setMessage = message.setMessage('loginValidation', 'Password fields is not defined')
        expect(message.getMessage('loginValidation')).toBe('Password fields is not defined')
    })

    test('It should not return a saved message', () => {
        const setMessage = message.setMessage('registerValidation', 'Email already exists')
        expect(message.getMessage('contact')).toBeNull()
    })
})