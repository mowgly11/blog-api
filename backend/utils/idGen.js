const chars = 'azertyuiopqsdfghjklmwxcvbn123456789AZERTYUIOPQSDFGHJKLMWXCVBN';

class IDManager {
    static genUniqueID(length) {
        let result = [];
        for(let i = 0; i < length; i++) {
            result[i] = chars[Math.floor(Math.random() * chars.length)];
        }

        return result.join('');
    }
}

export default IDManager;