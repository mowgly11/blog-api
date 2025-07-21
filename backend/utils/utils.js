class Utils {
    getResponseVariables(status = 200, error = null, data = null) {
        return {
            status,
            error,
            data
        }
    }
}

export default new Utils();