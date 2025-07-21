class Utils {
    static getResponseVariables(status = 200, error = null, data = null) {
        return {
            status,
            error,
            data
        }
    }
}

export default Utils;