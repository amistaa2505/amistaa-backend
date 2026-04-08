class UserSerializer {

    static serialize(user) {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role,
            gender: user.gender,
            status: user.status,
            isVerified: user.isVerified,
            avatar: user.avatar,
            interests: user.interests,
            location: user.location,
            createdAt: user.createdAt,
        }
    }

    static serializeMany(users) {
        return users.map(user => this.serialize(user));
    }

}


module.exports = UserSerializer;
