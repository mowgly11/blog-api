class Utils {
    getResponseVariables(status, error, data) {
        return {
            status: status || 200,
            error: error || null,
            data: data || null
        }
    }
}

export default new Utils();