class BaseSerializer {

    static removeFields(obj, fields = []) {

        const data = { ...obj };

        fields.forEach(field => delete data[field]);

        return data;

    }

}

module.exports = BaseSerializer;