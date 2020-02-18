'use strict'
const User = use('App/Models/User')

class UserController {
  // creating and saving a new user (sign-up)
  async store ({ request, response }) {
    try {
      // getting data passed within the request
      const data = request.only(['username', 'email', 'password'])

      // looking for user in database
      const userExists = await User.findBy('email', data.email)

      // if user exists don't save
      if (userExists) {
        return response
          .status(400)
          .send({ message: { error: 'User already registered' } })
      }

      // if user doesn't exist, proceeds with saving him in DB
      const user = await User.create(data)

      return user
    } catch (err) {
      return response
        .status(err.status)
        .send(err)
    }
  }

  async login({request, auth, response}) {

    let {email, password} = request.all();

    try {
      if (await auth.attempt(email, password)) {
        let user = await User.findBy('email', email)
        let token = await auth.generate(user)

        Object.assign(user, token)
        return response.json(user)
      }


    }
    catch (e) {
      console.log(e)
      return response.json({message: 'You are not registered!'})
    }
  }
}

module.exports = UserController
